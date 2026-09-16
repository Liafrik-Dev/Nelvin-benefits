import React, { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";

const faqs = [
  { q: "How does Nelvin Benefits work?", a: "Nelvin is a membership-based savings platform. Sign up, choose your plan and instantly access thousands of exclusive offers and cashback rewards from top brands across Africa." },
  { q: "Which countries is Nelvin Benefits available in?", a: "Nelvin is currently live across all 54 African countries, with over 500,000 exclusive offers available from 20,000+ partner brands." },
  { q: "Can I use my membership when I travel?", a: "Yes! Your Nelvin membership works across all African countries. Whether you're dining in Lagos, shopping in Nairobi, or enjoying a spa in Marrakech — your benefits travel with you." },
  { q: "How are merchants verified?", a: "Every merchant on our platform goes through a thorough verification process including business registration, quality checks and ongoing customer feedback monitoring." },
  { q: "Can businesses join Nelvin Benefits?", a: "Absolutely! Businesses can join as merchant partners to reach millions of engaged members. Visit our For Business page to learn about partnership opportunities." },
  { q: "What about corporate memberships?", a: "We offer tailored corporate plans for businesses that want to provide savings benefits to their employees. Contact our enterprise team for custom packages." },
];

/**
 * FAQ — the reference pairs a sticky intro column with a single-open
 * accordion list on the right. Structure kept, surfaces updated.
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="surface-nv-secondary section-nv">
      <div className="container-nv flex flex-col gap-12 lg:flex-row">
        <div className="lg:w-1/3">
          <p className="eyebrow-nv mb-3">Frequently asked</p>
          <h2 className="text-balance-nv text-3xl font-bold font-heading leading-tight text-ivory sm:text-4xl">
            Everything you need to know.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ivory-muted">
            Can't find your answer? Our support team responds in under an hour,
            seven days a week.
          </p>
          <a
            href="mailto:Nelvin23@proton.me"
            className="btn-nv btn-nv-md btn-nv-outline mt-6 w-fit"
          >
            <MessageCircle className="h-4 w-4 text-gold" />
            Talk to us
          </a>
        </div>

        <div className="space-y-3 lg:w-2/3">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-xl border bg-[#FFFFFF] transition-colors ${
                  open ? "border-[#1B4F9C]/35" : "border-[#F1F1F1]"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-bold text-ivory">{faq.q}</span>
                    {open ? (
                      <Minus className="h-4 w-4 shrink-0 text-gold" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-ivory-muted" />
                    )}
                  </button>
                </h3>
                {open && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-ivory-muted">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}