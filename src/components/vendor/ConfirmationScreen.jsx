import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TIMELINE = [
  { label: "Application Received", done: true },
  { label: "Under Review", done: false },
  { label: "Verification", done: false },
  { label: "Approved", done: false },
  { label: "Published", done: false },
];

export default function ConfirmationScreen() {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-16 bg-[#0A3A2F] rounded-full flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle2 className="w-9 h-9 text-[#D6B56D]" />
      </motion.div>

      <h1 className="text-2xl font-bold text-ivory mb-2">🎉 Thank You!</h1>
      <p className="text-ivory-muted text-sm">
        Your application has been received. Our Partnership Team is reviewing your submission.
      </p>
      <p className="text-ivory-dim text-xs mt-2 flex items-center justify-center gap-1.5">
        <Clock className="w-3.5 h-3.5" /> Typical review time: 24–48 hours
      </p>

      <div className="mt-10 bg-[#f9f9fb] rounded-lg p-6 text-left">
        <p className="text-xs font-semibold text-ivory-dim uppercase tracking-wider mb-4">Progress Timeline</p>
        <div className="space-y-4">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-[#D6B56D] flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-white/12 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.done ? "text-ivory font-medium" : "text-ivory-dim"}`}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/" className="flex-1 bg-[#062B23] hover:bg-emerald-black text-white rounded-full py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg">
          Return to Home
        </Link>
        <button
          onClick={() => toast({ title: "Application tracking is coming soon" })}
          className="flex-1 bg-[#0A3A2F]/5 hover:bg-[#0A3A2F]/10 text-ivory rounded-full py-3 text-sm font-semibold transition-all"
        >
          Track My Application
        </button>
        <a href="mailto:Nelvin23@proton.me" className="flex-1 bg-[#0A3A2F]/5 hover:bg-[#0A3A2F]/10 text-ivory rounded-full py-3 text-sm font-semibold transition-all">
          Contact Support
        </a>
      </div>
    </motion.div>
  );
}