import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
import { setPendingPlan, getPendingPlan, resolvePostAuthPath } from "@/lib/planPersistence";

export default function AuthForm({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("subscriber"); // 'subscriber', 'hr_admin', 'business'
  const [activeAction, setActiveAction] = useState(isRegister ? "signup" : "login"); // 'login', 'signup'

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
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Verify Your Email</h2>
          <p className="text-slate-500 text-sm">We sent a 6-digit confirmation code to <strong className="text-slate-800">{email}</strong></p>
          {serverError && <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">{serverError}</div>}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button className="w-full h-12 bg-[#7637E3] hover:bg-[#6229c3] text-white font-bold rounded-full" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Access Portal"}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-10">
        {/* Title and Subtitle Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Choose Your Access Portal
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Select the appropriate portal based on your role to access MyBenefits platform.
          </p>
        </div>

        {/* Access Portal Selector Tabs matching screenshot */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner max-w-md w-full">
            <button
              type="button"
              onClick={() => setActiveTab("subscriber")}
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "subscriber"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4 text-[#7637E3]" /> Users
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hr_admin")}
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "hr_admin"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-[#7637E3]" /> HR Teams
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("business")}
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "business"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Store className="w-4 h-4 text-[#7637E3]" /> Partners
            </button>
          </div>
        </div>

        {/* Portal Role Context Header */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
            <User className="w-5 h-5 text-[#7637E3]" />
            For {activeTab === "subscriber" ? "Users" : activeTab === "hr_admin" ? "HR Teams & Employers" : "Partners & Merchants"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeTab === "subscriber"
              ? "Access your employee benefits and exclusive discounts through our web application or mobile app."
              : activeTab === "hr_admin"
              ? "Manage company benefits, employee eligibility, communications, and analytics in real-time."
              : "Publish deals, issue vouchers, verify redemptions, and scale audience reach across member companies."}
          </p>
        </div>

        {/* 3 Main Action Cards matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Log in */}
          <div
            onClick={() => setActiveAction("login")}
            className={`group cursor-pointer rounded-3xl bg-white border-2 p-6 sm:p-8 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-xl relative overflow-hidden ${
              activeAction === "login" ? "border-[#7637E3] ring-2 ring-[#7637E3]/20" : "border-slate-100 hover:border-slate-300"
            }`}
          >
            <div className="w-full h-1.5 bg-gradient-to-r from-pink-500 to-purple-600 absolute top-0 left-0" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
              <LogIn className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Log in to Web App</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access your benefits & discounts through the web application
            </p>
          </div>

          {/* Card 2: Sign up */}
          <div
            onClick={() => setActiveAction("signup")}
            className={`group cursor-pointer rounded-3xl bg-white border-2 p-6 sm:p-8 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-xl relative overflow-hidden ${
              activeAction === "signup" ? "border-[#7637E3] ring-2 ring-[#7637E3]/20" : "border-slate-100 hover:border-slate-300"
            }`}
          >
            <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
              <UserPlus className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Sign up as New User</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a new account to access benefits through the web application
            </p>
          </div>

          {/* Card 3: Mobile App */}
          <div
            onClick={() => toast({ title: "Mobile App", description: "Download link sent or available on App Store & Google Play." })}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-slate-100 p-6 sm:p-8 flex flex-col items-center text-center transition-all shadow-sm hover:shadow-xl hover:border-slate-300 relative overflow-hidden"
          >
            <div className="w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 absolute top-0 left-0" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">Download Mobile App</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get the MyBenefits app on your mobile device for iOS & Android
            </p>
          </div>
        </div>

        {/* Embedded Interactive Auth Form Container */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              {activeAction === "signup" ? "Create Account" : "Log In"} — {activeTab === "subscriber" ? "Member" : activeTab === "hr_admin" ? "HR Employer" : "Partner"}
            </h3>
            <span className="text-xs font-semibold text-[#7637E3] bg-[#7637E3]/10 px-3 py-1 rounded-full">
              {activeTab.toUpperCase()}
            </span>
          </div>

          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
              {serverError}
            </div>
          )}

          {/* Social OAuth options */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 text-xs font-bold" onClick={() => handleProvider("google")}>
              <GoogleIcon className="w-4 h-4 mr-2" /> Google
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl border-slate-200 text-xs font-bold" onClick={() => handleProvider("apple")}>
              <AppleIcon className="w-4 h-4 mr-2" /> Apple
            </Button>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-3 text-slate-400">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeAction === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">First Name</Label>
                  <Input placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.firstName && <p className="text-[10px] text-rose-600 font-bold">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Last Name</Label>
                  <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 text-xs rounded-xl" />
                  {errors.lastName && <p className="text-[10px] text-rose-600 font-bold">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-xs rounded-xl" />
              {errors.email && <p className="text-[10px] text-rose-600 font-bold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
              {errors.password && <p className="text-[10px] text-rose-600 font-bold">{errors.password}</p>}
            </div>

            {activeAction === "signup" && (
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-700">Confirm Password</Label>
                <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 text-xs rounded-xl" />
                {errors.confirmPassword && <p className="text-[10px] text-rose-600 font-bold">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#7637E3] hover:bg-[#6229c3] text-white font-bold text-sm rounded-2xl shadow-md transition-all"
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
