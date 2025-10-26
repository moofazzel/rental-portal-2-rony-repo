"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

function PecanLandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What size RVs do you accommodate?",
      answer:
        "We accommodate RVs of all sizes, from small travel trailers to large motorhomes up to 45 feet. Our pull-through sites make parking easy for any size rig.",
    },
    {
      question: "Are pets allowed?",
      answer:
        "Yes! We're a pet-friendly community. We welcome up to 2 pets per site with no additional fees. We have designated pet areas and walking trails throughout the park.",
    },
    {
      question: "What's included in the monthly rent?",
      answer:
        "Monthly rent includes full hookups (electric, water, sewer), WiFi, cable TV, trash service, and access to all park amenities including laundry facilities, showers, and recreational areas.",
    },
    {
      question: "How do I pay my rent?",
      answer:
        "We offer convenient online payment through your resident portal using credit card, debit card, or ACH transfer. You can also set up automatic payments for added convenience.",
    },
    {
      question: "Is there a security deposit?",
      answer:
        "Yes, we require a refundable security deposit equal to one month's rent for long-term stays. This is fully refundable upon move-out if there's no damage to the site.",
    },
    {
      question: "Can I choose my specific spot?",
      answer:
        "Long-term and annual residents get priority in site selection. We'll work with you to find the perfect spot that meets your needs, whether you prefer shade, sun, or proximity to amenities.",
    },
  ];
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition-all overflow-hidden"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full px-8 py-6 flex items-center justify-between text-left group"
          >
            <span className="text-lg font-bold text-slate-900 pr-8 group-hover:text-emerald-600 transition-colors">
              {faq.question}
            </span>
            <div
              className={`flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center transition-all duration-300 ${
                openFaq === index ? "rotate-45 bg-emerald-500" : ""
              }`}
            >
              <ChevronRight
                className={`size-6 transition-colors ${
                  openFaq === index ? "text-white" : "text-emerald-600"
                }`}
              />
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              openFaq === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-8 pb-6 pt-2">
              <p className="text-slate-600 leading-relaxed text-lg">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PecanLandingFaq;
