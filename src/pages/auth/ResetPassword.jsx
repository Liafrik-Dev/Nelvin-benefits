import { db } from "@/services/api/dataClient";

import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const tokenHash = searchParams.get("token_hash");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.resetPassword({
        resetToken: resetToken || tokenHash || undefined,
        tokenType: tokenHash ? "token_hash" : "recovery",
        newPassword,
      });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken && !tokenHash) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        eyebrow="Account recovery"
        title="Invalid reset link"
        subtitle="This password reset link is missing or has expired."
        footer={
          <Link to="/forgot-password" className="inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Request a new link
          </Link>
        }
      >
        <div className="rounded-2xl border border-[#E3E3E3] bg-[#FFFFFF] p-6 text-center shadow-nv-card-hover sm:p-8">
          <p className="text-sm leading-relaxed text-[#484848]">
            The link you used appears to be incomplete. Request a new password
            reset email and we&rsquo;ll send you a fresh one.
          </p>
          <Link to="/forgot-password" className="btn-nv btn-nv-md btn-nv-gold mt-6 w-full">
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      eyebrow="Account recovery"
      title="Choose a new password"
      subtitle="Pick a strong password you haven't used before."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to log in
        </Link>
      }
    >
      <div className="rounded-2xl border border-[#E3E3E3] bg-[#FFFFFF] p-6 shadow-nv-card-hover sm:p-8">
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold text-[#282828]">
              New password
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                aria-hidden="true"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                autoFocus
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 rounded-xl pl-10 pr-11 text-sm"
                required
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
            <p className="text-[11px] text-[#6B6B6B]">At least 6 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-xs font-bold text-[#282828]">
              Confirm new password
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                aria-hidden="true"
              />
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-xl pl-10 text-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-[#1B4F9C] text-sm font-bold text-white transition-colors hover:bg-[#123A78]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
