import React from "react";
import { motion } from "framer-motion";

const STAGES = ["Business Information", "Verification", "Complete"];
// step index (0-3) -> [stageIndex, fillPercent]
const STEP_MAP = [
  [0, 12],
  [1, 45],
  [1, 68],
  [2, 88],
];

export default function OnboardingProgressBar({ step, complete }) {
  const [activeStage, percent] = complete ? [2, 100] : STEP_MAP[step] || [0, 12];

  return (
    <div className="max-w-md mx-auto mb-10">
      <div className="flex justify-between mb-3">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium tracking-wide transition-colors ${
              i <= activeStage ? "text-ivory" : "text-ivory-dim"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#062B23] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}