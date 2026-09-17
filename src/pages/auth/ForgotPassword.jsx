import { db } from "@/services/api/base44Client";

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

/**
 * Password reset request.
 *
 * The local backend has no mail transport, so when it hands back a reset token
 * we surface the link directly — otherwise the flow would dead-end with a
 * "check your inbox" message for an email that can never arrive. A real backend
 * (Supabase) returns no token here, and the message stays as it was.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [localToken, setLocalToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await db.auth.resetPasswordRequest(email);
      setLocalToken(res?.token || null);
    } catch {
      // Never reveal whether the address exists.
      setLocalToken(null);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send you a secure reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to log in
        </Link>
      }
    >
      <div className="rounded-2xl border border-[#E3E3E3] bg-[#FFFFFF] p-6 shadow-nv-card-hover sm:p-8">
        {sent ? (
          <div className="space-y-5 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4F9C]/10">
              <CheckCircle2 className="h-6 w-6 text-[#1B4F9C]" />
            </span>
            <p className="text-sm leading-relaxed text-[#484848]">
              If an account exists for <strong className="text-[#282828]">{email}</strong>,
              a password reset link is on its way.
            </p>

            {localToken ? (
              <div className="space-y-3 rounded-xl bg-[#F9F8F7] p-4 text-left ring-1 ring-[#F1F1F1]">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B]">
                  Demo mode — no email is sent
                </p>
                <p className="text-xs leading-relaxed text-[#484848]">
                  This build runs without a mail service, so use the link below to
                  finish resetting your password.
                </p>
                <Link
                  to={`/reset-password?token=${localToken}`}
                  className="btn-nv btn-nv-md btn-nv-gold group w-full"
                >
                  Continue to reset password
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : null}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-[#282828]">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}