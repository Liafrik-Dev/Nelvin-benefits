import { db } from "@/services/api/dataClient";

import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import OnboardingProgressBar from "@/components/vendor/OnboardingProgressBar";
import StepBusinessInfo from "@/components/vendor/StepBusinessInfo";
import StepVerification from "@/components/vendor/StepVerification";
import StepFaceVerification from "@/components/vendor/StepFaceVerification";
import StepReview from "@/components/vendor/StepReview";
import ConfirmationScreen from "@/components/vendor/ConfirmationScreen";

const emptyForm = {
  business_name: "",
  contact_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  category: "",
  business_address: "",
  website: "",
  description: "",
  business_image_urls: [],
  document_type: "",
  document_url: "",
  id_document_url: "",
  logo_url: "",
  selfie_url: "",
};

export default function VendorOnboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const { toast } = useToast();

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.business_name || !form.contact_name || !form.email || !form.category || !form.country || !confirmed) {
      toast({ title: "Missing information", description: "Please complete all required fields before submitting.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await db.entities.VendorApplication.create({
        ...form,
        owner_id: user?.id,
        authorized_confirmation: confirmed,
      });
      setSubmitted(true);
    } catch (err) {
      toast({ title: "Submission failed", description: "Something went wrong while submitting your application. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    <StepBusinessInfo key="0" form={form} update={update} onNext={() => setStep(1)} />,
    <StepVerification key="1" form={form} update={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <StepFaceVerification key="2" form={form} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <StepReview
      key="3"
      form={form}
      confirmed={confirmed}
      setConfirmed={setConfirmed}
      onBack={() => setStep(2)}
      onSubmit={handleSubmit}
      submitting={submitting}
    />,
  ];

  const variants = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] pt-24 pb-14 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 bg-[#FFFFFF] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#282828]">Grow your business with Nelvin</h1>
          <p className="text-[#484848] mt-3">Reach 2.4M+ members across Africa. Onboard your business in minutes.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-[24px] p-6 sm:p-10 shadow-sm">
          {!submitted && <OnboardingProgressBar step={step} complete={false} />}
          <AnimatePresence mode="wait">
            {submitted ? (
              <ConfirmationScreen key="confirmation" />
            ) : (
              <motion.div
                key={step}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}