import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2, ArrowRight, Building2, Store, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleIcon from "@/components/shared/GoogleIcon";
import AppleIcon from "@/components/shared/AppleIcon";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/AuthContext";
import { setPendingPlan, resolvePostAuthPath } from "@/lib/planPersistence";

/**
 * The portal that matches the account's real role.
 *
 * The role tabs above the form are a convenience for sign-up, but they used to
 * drive the post-login destination too. A subscriber who happened to have the
 * "Partner" tab selected was therefore sent to /business and met with
 * "Business access required" — with the session already live, so going back to
 * /login redirected them to /dashboard. Login looked broken.
 *
 * The account's own role wins. The selected tab is only a fallback for the odd
 * case where an account somehow carries no role at all.
 */
function destinationForRole(user, tab) {
  // Supabase exposes the profile role under user_metadata; the local store
  // keeps it at the top level.
  const role = user?.role || user?.user_metadata?.role;
  if (role === "business" || role === "partner") return "/business";
  if (role === "hr_admin" || role === "corporate") return "/corporate-dashboard";
  if (role) return resolvePostAuthPath();

  if (tab === "business") return "/business";
  if (tab === "hr_admin") return "/corporate-dashboard";
  return resolvePostAuthPath();
}

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("subscriber");
  const [activeAction, setActiveAction] = useState(isRegister ? "signup" : "login");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) setPendingPlan(p);
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      window.location.href = destinationForRole(user, activeTab);
    }
  }, [isLoadingAuth, isAuthenticated, activeTab, user]);

  const validate = () => {
    const e = {};
    if (activeAction === "signup") {
      if (!firstName.trim()) e.firstName = "First name required";
      if (!lastName.trim()) e.lastName = "Last name required";
    }
    if (!email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!password) e.password = "Password required";
    else if (password.length < 6) e.password = "Min 6 characters";
    if (activeAction === "signup") {
      if (!confirmPassword) e.confirmPassword = "Confirm password";
      else if (password !== confirmPassword) e.confirmPassword = "Passwords mismatch";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProvider = (provider) => {
    setServerError("");
    try {
      db.auth.loginWithProvider(provider, resolvePostAuthPath());
    } catch (err) {
      setServerError(`${provider === "apple" ? "Apple" : "Google"} sign-in failed — ${err.message || "try again"}`);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (activeAction === "signup") {
        const res = await db.auth.register({ email, password, role: activeTab });
        if (res?.session) {
          // Email confirmation disabled — session is live; go straight in.
          window.location.href = destinationForRole(res?.user, activeTab);
        } else {
          setShowOtp(true);
        }
      } else {
        const res = await db.auth.loginViaEmailPassword(email, password);
        window.location.href = destinationForRole(res?.user, activeTab);
      }
    } catch (err) {
      setServerError(err.message || (activeAction === "signup" ? "Registration failed" : "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setServerError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) db.auth.setToken(result.access_token);
      try { await db.auth.updateMe({ first_name: firstName, last_name: lastName, role: activeTab }); } catch {}
      // The tab is the source of truth here: the role was just written from it.
      if (activeTab === "business") window.location.href = "/business";
      else if (activeTab === "hr_admin") window.location.href = "/corporate-dashboard";
      else window.location.href = resolvePostAuthPath();
    } catch (err) {
      setServerError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <AuthLayout>
        <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-[#E3E3E3] bg-[#FFFFFF] p-8 text-center shadow-nv-card-hover">
          <h2 className="font-heading text-2xl font-black text-[#282828]">Verify your email</h2>
          <p className="text-sm text-[#484848]">We sent a 6-digit code to <strong className="text-[#282828]">{email}</strong></p>
          {serverError && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">{serverError}</div>}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="h-12 w-full rounded-xl bg-[#1B4F9C] font-bold text-white transition-colors hover:bg-[#123A78]" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Access Portal"}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-black tracking-tight text-[#282828] sm:text-3xl">
            {activeAction === "signup" ? (
              <>Create your <span className="text-gold-gradient">NelvinBenefit</span> account</>
            ) : (
              "Welcome back"
            )}
          </h1>
          <p className="mx-auto max-w-md text-sm text-[#484848]">
            Access your account across Member, HR, or Partner portals in one place.
          </p>
        </div>

        {/* Single Unified Form Box */}
        <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-[#E3E3E3] bg-[#FFFFFF] p-6 shadow-nv-card-hover sm:p-8">
          {/* Role Tabs */}
          <div
            className="grid grid-cols-3 gap-1.5 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-1.5 text-center text-xs font-extrabold"
            role="tablist"
            aria-label="Account type"
          >
            {[
              { id: "subscriber", label: "Particulier", Icon: User },
              { id: "hr_admin", label: "HR Team", Icon: Building2 },
              { id: "business", label: "Partner", Icon: Store },
            ].map(({ id, label, Icon }) => {
              const on = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 transition-colors ${
                    on
                      ? "bg-[#1B4F9C] text-white shadow-nv-card"
                      : "text-[#484848] hover:bg-white hover:text-[#282828]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
                </button>
              );
            })}
          </div>

          {/* Action Toggle (Login vs Signup) */}
          <div className="flex items-center justify-between gap-3 border-b border-[#F1F1F1] pb-3 pt-1">
            <div className="flex gap-5">
              {[
                { id: "login", label: "Log In" },
                { id: "signup", label: "Create Account" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveAction(id)}
                  className={`border-b-2 pb-1 font-heading text-sm font-black transition-colors ${
                    activeAction === id
                      ? "border-[#1B4F9C] text-[#282828]"
                      : "border-transparent text-[#6B6B6B] hover:text-[#484848]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="shrink-0 rounded border border-[#1B4F9C]/30 bg-[#1B4F9C]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1B4F9C]">
              {activeTab === "subscriber" ? "Particulier" : activeTab === "hr_admin" ? "HR Portal" : "Partner"}
            </span>
          </div>

          {serverError && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "google", label: "Google", Icon: GoogleIcon },
              { id: "apple", label: "Apple", Icon: AppleIcon },
            ].map(({ id, label, Icon }) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                onClick={() => handleProvider(id)}
                className="h-11 rounded-xl border-[#E3E3E3] text-xs font-bold text-[#282828]"
              >
                <Icon className="mr-2 h-4 w-4" /> {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#F1F1F1]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B6B6B]">
              or continue with email
            </span>
            <span className="h-px flex-1 bg-[#F1F1F1]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {activeAction === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="auth-first-name" className="text-xs font-bold text-[#282828]">First Name</Label>
                  <Input id="auth-first-name" autoComplete="given-name" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl text-sm" />
                  {errors.firstName && <p className="text-[10px] text-rose-600 font-bold">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="auth-last-name" className="text-xs font-bold text-[#282828]">Last Name</Label>
                  <Input id="auth-last-name" autoComplete="family-name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl text-sm" />
                  {errors.lastName && <p className="text-[10px] text-rose-600 font-bold">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="auth-email" className="text-xs font-bold text-[#282828]">Email Address</Label>
              <Input id="auth-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl text-sm" />
              {errors.email && <p className="text-[10px] text-rose-600 font-bold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="auth-password" className="text-xs font-bold text-[#282828]">Password</Label>
                {activeAction === "login" ? (
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-[#1B4F9C] hover:underline"
                  >
                    Forgot password?
                  </Link>
                ) : null}
              </div>
              <div className="relative">
                <Input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={activeAction === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#6B6B6B] transition-colors hover:text-[#282828]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-600">{errors.password}</p>}
            </div>

            {activeAction === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="auth-confirm-password" className="text-xs font-bold text-[#282828]">Confirm Password</Label>
                <Input id="auth-confirm-password" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 rounded-xl text-sm" />
                {errors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#1B4F9C] text-sm font-extrabold text-white shadow-nv-card transition-colors hover:bg-[#123A78]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {activeAction === "signup" ? "Create Account" : "Log In"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
