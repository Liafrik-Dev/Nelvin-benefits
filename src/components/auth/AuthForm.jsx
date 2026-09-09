import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, UserPlus, LogIn, Loader2, ArrowRight, Building2, Store, Users, Smartphone, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleIcon from "@/components/shared/GoogleIcon";
import AppleIcon from "@/components/shared/AppleIcon";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { setPendingPlan, resolvePostAuthPath } from "@/lib/planPersistence";

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();

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

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) setPendingPlan(p);
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      if (activeTab === "business") {
        window.location.href = "/business";
      } else if (activeTab === "hr_admin") {
        window.location.href = "/corporate-dashboard";
      } else {
        window.location.href = resolvePostAuthPath();
      }
    }
  }, [isLoadingAuth, isAuthenticated, activeTab]);

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
        await db.auth.register({ email, password, role: activeTab });
        setShowOtp(true);
      } else {
        await db.auth.loginViaEmailPassword(email, password);
        if (activeTab === "business") window.location.href = "/business";
        else if (activeTab === "hr_admin") window.location.href = "/corporate-dashboard";
        else window.location.href = resolvePostAuthPath();
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl text-gray-900 text-center space-y-6">
          <h2 className="text-2xl font-bold font-heading">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">We sent a 6-digit confirmation code to <strong>{email}</strong></p>
          {serverError && <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">{serverError}</div>}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="w-full h-12 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-bold rounded-full" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Access Portal"}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Title and Subtitle Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Choose Your Access Portal
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Select the appropriate portal based on your role to access MyBenefits platform.
          </p>
        </div>

        {/* Access Portal Selector Tabs matching brand palette */}
        <div className="flex justify-center">
          <div className="inline-flex bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur max-w-md w-full">
            <button
              type="button"
              onClick={() => setActiveTab("subscriber")}
              className={`flex-1 py-2 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "subscriber"
                  ? "bg-[#B8FF00] text-[#082F24] shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" /> Users
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hr_admin")}
              className={`flex-1 py-2 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "hr_admin"
                  ? "bg-[#B8FF00] text-[#082F24] shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" /> HR Teams
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`flex-1 py-2 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "business"
                  ? "bg-[#B8FF00] text-[#082F24] shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4" /> Partners
            </button>
          </div>
        </div>

        {/* 3 Main Action Cards matching brand green colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Log in */}
          <div
            onClick={() => setActiveAction("login")}
            className={`group cursor-pointer rounded-3xl bg-white text-gray-900 border-2 p-6 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-2xl relative overflow-hidden ${
              activeAction === "login" ? "border-[#B8FF00] ring-4 ring-[#B8FF00]/30" : "border-white/20"
            }`}
          >
            <div className="w-full h-1.5 bg-[#00BD00] absolute top-0 left-0" />
            <div className="w-12 h-12 rounded-2xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold mb-1 font-heading">Log in to Web App</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Access your benefits & discounts through the web application
            </p>
          </div>

          {/* Card 2: Sign up */}
          <div
            onClick={() => setActiveAction("signup")}
            className={`group cursor-pointer rounded-3xl bg-white text-gray-900 border-2 p-6 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-2xl relative overflow-hidden ${
              activeAction === "signup" ? "border-[#B8FF00] ring-4 ring-[#B8FF00]/30" : "border-white/20"
            }`}
          >
            <div className="w-full h-1.5 bg-[#B8FF00] absolute top-0 left-0" />
            <div className="w-12 h-12 rounded-2xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold mb-1 font-heading">Sign up as New User</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Create a new account to access benefits through the web application
            </p>
          </div>

          {/* Card 3: Mobile App */}
          <div
            onClick={() => toast({ title: "Mobile App", description: "Download link sent or available on App Store & Google Play." })}
            className="group cursor-pointer rounded-3xl bg-white text-gray-900 border-2 border-white/20 p-6 flex flex-col items-center text-center transition-all shadow-lg hover:shadow-2xl relative overflow-hidden"
          >
            <div className="w-full h-1.5 bg-[#082F24] absolute top-0 left-0" />
            <div className="w-12 h-12 rounded-2xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold mb-1 font-heading">Download Mobile App</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Get the MyBenefits app on your mobile device for iOS & Android
            </p>
          </div>
        </div>

        {/* Form Box */}
        <div className="max-w-lg mx-auto bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold font-heading">
              {activeAction === "signup" ? "Create Account" : "Log In"} — {activeTab === "subscriber" ? "Member" : activeTab === "hr_admin" ? "HR Employer" : "Partner"}
            </h3>
            <span className="text-[10px] font-extrabold text-[#082F24] bg-[#B8FF00] px-2.5 py-1 rounded-full uppercase">
              {activeTab}
            </span>
          </div>

          {serverError && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 rounded-xl border-gray-200 text-xs font-bold" onClick={() => handleProvider("google")}>
              <GoogleIcon className="w-4 h-4 mr-2" /> Google
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-gray-200 text-xs font-bold" onClick={() => handleProvider("apple")}>
              <AppleIcon className="w-4 h-4 mr-2" /> Apple
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {activeAction === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-700">First Name</Label>
                  <Input placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.firstName && <p className="text-[10px] text-rose-600 font-bold">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-700">Last Name</Label>
                  <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.lastName && <p className="text-[10px] text-rose-600 font-bold">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-bold text-gray-700">Email Address</Label>
              <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-xs rounded-xl" />
              {errors.email && <p className="text-[10px] text-rose-600 font-bold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-gray-700">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
              {errors.password && <p className="text-[10px] text-rose-600 font-bold">{errors.password}</p>}
            </div>

            {activeAction === "signup" && (
              <div className="space-y-1">
                <Label className="text-xs font-bold text-gray-700">Confirm Password</Label>
                <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
                {errors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#082F24] hover:bg-emerald-950 text-[#B8FF00] font-extrabold text-xs rounded-2xl shadow-md transition-all"
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
