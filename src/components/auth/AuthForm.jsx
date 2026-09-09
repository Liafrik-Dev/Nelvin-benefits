import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, UserPlus, LogIn, Loader2, ArrowRight, ShieldCheck, Sparkles, Building2, Store, Users } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleIcon from "@/components/shared/GoogleIcon";
import AppleIcon from "@/components/shared/AppleIcon";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { setPendingPlan, getPendingPlan, resolvePostAuthPath, PAID_PLANS } from "@/lib/planPersistence";

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const reduceMotion = useReducedMotion();

  const [accountRole, setAccountRole] = useState("subscriber"); // 'subscriber', 'hr_admin', 'business'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const enter = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  const cardInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 };
  const swapInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 };
  const swapExit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 };
  const hover = reduceMotion ? undefined : { scale: 1.02 };
  const tap = reduceMotion ? undefined : { scale: 0.98 };
  const ease = [0.22, 1, 0.36, 1];

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) setPendingPlan(p);
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      if (accountRole === "business") {
        window.location.href = "/business";
      } else if (accountRole === "hr_admin") {
        window.location.href = "/corporate-dashboard";
      } else {
        window.location.href = resolvePostAuthPath();
      }
    }
  }, [isLoadingAuth, isAuthenticated, accountRole]);

  const pendingPlan = getPendingPlan();
  const showPlanBanner = pendingPlan && PAID_PLANS.includes(pendingPlan);

  const validate = () => {
    const e = {};
    if (isRegister) {
      if (!firstName.trim()) e.firstName = "First name is required";
      if (!lastName.trim()) e.lastName = "Last name is required";
    }
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "At least 8 characters";
    if (isRegister) {
      if (!confirmPassword) e.confirmPassword = "Confirm your password";
      else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProvider = (provider) => {
    setServerError("");
    try {
      db.auth.loginWithProvider(provider, resolvePostAuthPath());
    } catch (err) {
      setServerError(
        `${provider === "apple" ? "Apple" : "Google"} sign-in failed — ${err.message || "please try again"}.`
      );
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (isRegister) {
        await db.auth.register({ email, password, role: accountRole });
        setShowOtp(true);
      } else {
        await db.auth.loginViaEmailPassword(email, password);
        if (accountRole === "business") window.location.href = "/business";
        else if (accountRole === "hr_admin") window.location.href = "/corporate-dashboard";
        else window.location.href = resolvePostAuthPath();
      }
    } catch (err) {
      setServerError(err.message || (isRegister ? "Registration failed" : "Invalid email or password"));
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
      try { await db.auth.updateMe({ first_name: firstName, last_name: lastName, role: accountRole }); } catch {}
      if (accountRole === "business") window.location.href = "/business";
      else if (accountRole === "hr_admin") window.location.href = "/corporate-dashboard";
      else window.location.href = resolvePostAuthPath();
    } catch (err) {
      setServerError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setServerError("");
    try {
      await db.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the code." });
    } catch (err) {
      setServerError(err.message || "Failed to resend code");
    }
  };

  const footer = isRegister ? (
    <>Already have an account?{" "}
      <Link to="/login" className="text-[#B8FF00] font-bold hover:underline">Log in</Link></>
  ) : (
    <>Don't have an account?{" "}
      <Link to="/register" className="text-[#B8FF00] font-bold hover:underline">Create one</Link></>
  );

  if (showOtp) {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a 6-digit code to ${email}`}>
        {serverError && <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">{serverError}</div>}
        <motion.div initial={swapInitial} animate={enter} transition={{ duration: 0.4, ease }} className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </motion.div>
        <Button className="w-full h-12 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-bold text-xs rounded-full" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify & Continue"}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-emerald-700 font-bold hover:underline">Resend</button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={accountRole === "business" ? Store : accountRole === "hr_admin" ? Building2 : Users}
      title={isRegister ? "Create account" : "Welcome back"}
      subtitle={isRegister ? "Sign up to unlock perks, benefits & merchant tools" : "Log in to access your portal"}
      footer={footer}
    >
      <motion.div initial={cardInitial} animate={enter} transition={{ duration: 0.5, ease }} className="space-y-4">
        {/* Account Role Selector */}
        <div className="bg-gray-100 p-1 rounded-2xl flex items-center justify-between gap-1 text-xs font-bold text-gray-600">
          <button
            type="button"
            onClick={() => setAccountRole("subscriber")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              accountRole === "subscriber" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" /> Member
          </button>
          <button
            type="button"
            onClick={() => setAccountRole("hr_admin")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              accountRole === "hr_admin" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" /> HR Employer
          </button>
          <button
            type="button"
            onClick={() => setAccountRole("business")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              accountRole === "business" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" /> Partner
          </button>
        </div>

        {showPlanBanner && (
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Continuing to <span className="font-bold uppercase">{pendingPlan}</span> plan after sign-in
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full h-11 text-xs font-bold rounded-2xl border-gray-200" onClick={() => handleProvider("google")}>
            <GoogleIcon className="w-4 h-4 mr-2" /> Google
          </Button>
          <Button variant="outline" className="w-full h-11 text-xs font-bold rounded-2xl border-gray-200" onClick={() => handleProvider("apple")}>
            <AppleIcon className="w-4 h-4 mr-2" /> Apple
          </Button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!showEmail && (
            <Button variant="outline" className="w-full h-11 text-xs font-bold rounded-2xl border-gray-200" onClick={() => setShowEmail(true)}>
              <Mail className="w-4 h-4 mr-2" /> Continue with Email
            </Button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {showEmail && (
            <div className="space-y-4">
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-3 text-gray-400">or</span></div>
              </div>

              {serverError && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">{serverError}</div>}

              <form onSubmit={handleSubmit} className="space-y-3">
                {isRegister && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-xs font-bold text-gray-700">First Name</Label>
                      <Input id="firstName" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 text-xs rounded-xl" />
                      {errors.firstName && <p className="text-[10px] text-rose-600 font-bold">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-xs font-bold text-gray-700">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 text-xs rounded-xl" />
                      {errors.lastName && <p className="text-[10px] text-rose-600 font-bold">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-700">Work / Personal Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.email && <p className="text-[10px] text-rose-600 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-bold text-gray-700">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.password && <p className="text-[10px] text-rose-600 font-bold">{errors.password}</p>}
                </div>

                {isRegister && (
                  <div className="space-y-1">
                    <Label htmlFor="confirm" className="text-xs font-bold text-gray-700">Confirm Password</Label>
                    <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
                    {errors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold">{errors.confirmPassword}</p>}
                  </div>
                )}

                {!isRegister && (
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-emerald-700 font-bold hover:underline">Forgot password?</Link>
                  </div>
                )}

                <Button type="submit" className="w-full h-11 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-bold text-xs rounded-full shadow-md" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <>{isRegister ? "Create Account" : "Log In"} <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>
              </form>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthLayout>
  );
}