import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, UserPlus, LogIn, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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

  // GPU-friendly motion: transform + opacity only. Reduced-motion users get a plain fade.
  const enter = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  const cardInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 };
  const swapInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 };
  const swapExit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 };
  const hover = reduceMotion ? undefined : { scale: 1.02 };
  const tap = reduceMotion ? undefined : { scale: 0.98 };
  const ease = [0.22, 1, 0.36, 1];

  // Persist any ?plan= from the URL so it survives the OAuth round-trip.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p) setPendingPlan(p);
  }, []);

  // Already authenticated? Skip the auth screen and continue the plan flow.
  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) window.location.href = resolvePostAuthPath();
  }, [isLoadingAuth, isAuthenticated]);

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
        `${provider === "apple" ? "Apple" : "Google"} sign-in failed — ${err.message || "please try again"}. Your selected plan is saved.`
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
        await db.auth.register({ email, password });
        setShowOtp(true);
      } else {
        await db.auth.loginViaEmailPassword(email, password);
        window.location.href = resolvePostAuthPath();
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
      try { await db.auth.updateMe({ first_name: firstName, last_name: lastName }); } catch { /* best-effort */ }
      window.location.href = resolvePostAuthPath();
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
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setServerError(err.message || "Failed to resend code");
    }
  };

  const footer = isRegister ? (
    <>Already have an account?{" "}
      <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>
  ) : (
    <>Don't have an account?{" "}
      <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>
  );

  if (showOtp) {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a code to ${email}`}>
        {serverError && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{serverError}</div>}
        <motion.div initial={swapInitial} animate={enter} transition={{ duration: 0.4, ease }} className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </motion.div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Resend</button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={isRegister ? UserPlus : LogIn}
      title={isRegister ? "Create your account" : "Welcome back"}
      subtitle={isRegister ? "Sign up to start saving" : "Log in to your account"}
      footer={footer}
    >
      <motion.div initial={cardInitial} animate={enter} transition={{ duration: 0.5, ease }}>
        {showPlanBanner && (
          <motion.div initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease }} className="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-amber-800 text-xs font-medium">
            <Sparkles className="w-4 h-4" />
            Continuing to <span className="font-bold uppercase">{pendingPlan}</span> membership after sign-in
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <motion.div whileHover={hover} whileTap={tap}>
            <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={() => handleProvider("google")}>
              <GoogleIcon className="w-5 h-5 mr-2" /> Google
            </Button>
          </motion.div>
          <motion.div whileHover={hover} whileTap={tap}>
            <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={() => handleProvider("apple")}>
              <AppleIcon className="w-5 h-5 mr-2" /> Apple
            </Button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!showEmail && (
            <motion.div key="emailBtn" initial={swapInitial} animate={enter} exit={swapExit} transition={{ duration: 0.28, ease }}>
              <Button variant="outline" className="w-full h-12 text-sm font-medium mt-3" onClick={() => setShowEmail(true)}>
                <Mail className="w-4 h-4 mr-2" /> Continue with Email
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {showEmail && (
            <motion.div key="emailForm" initial={swapInitial} animate={enter} exit={swapExit} transition={{ duration: 0.3, ease }}>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">or</span></div>
              </div>

              {serverError && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{serverError}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform duration-200 group-focus-within:scale-110" aria-hidden="true" />
                        <Input id="firstName" autoComplete="given-name" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10 h-12" />
                      </div>
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform duration-200 group-focus-within:scale-110" aria-hidden="true" />
                        <Input id="lastName" autoComplete="family-name" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="pl-10 h-12" />
                      </div>
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform duration-200 group-focus-within:scale-110" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" autoFocus={showEmail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform duration-200 group-focus-within:scale-110" aria-hidden="true" />
                    <Input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform duration-200 group-focus-within:scale-110" aria-hidden="true" />
                      <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>
                )}

                {!isRegister && (
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                  </div>
                )}

                <motion.div whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
                  <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
                    {loading
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isRegister ? "Creating account..." : "Logging in..."}</>
                      : <>{isRegister ? "Create account" : "Log in"} <ArrowRight className="w-4 h-4 ml-1" /></>}
                  </Button>
                </motion.div>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Your data is encrypted & secure
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthLayout>
  );
}