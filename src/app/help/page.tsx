"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Go to My Orders from your profile menu and select the order you want to track. You'll see the current status — Confirmed, Shipped, Out for Delivery, or Delivered.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Right now we support Cash on Delivery (COD) — pay when your order arrives at your doorstep.",
  },
  {
    q: "How do I return a product?",
    a: "Reach out to us through the Contact page within 7 days of delivery with your order number and reason for return. See our Returns Policy page for full details.",
  },
  {
    q: "I didn't receive my OTP. What do I do?",
    a: "Double check the phone number you entered is correct, then tap \"Change phone number\" to try again. If it still doesn't arrive after a couple of minutes, contact us and we'll help you sign in.",
  },
  {
    q: "Can I change my delivery address after placing an order?",
    a: "Contact us as soon as possible after placing your order. Once an order has shipped, we usually can't change the delivery address.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we deliver pan-India. Delivery time depends on your location and the seller shipping the product.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Help Center
        </h1>
        <p className="mt-2 text-gray-600">
          Answers to the questions we hear most often.
        </p>

        <div className="mt-8 space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                >
                  <span className="font-medium text-gray-800">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180 text-brand" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="border-t px-4 py-3 text-sm text-gray-600">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Still need help?{" "}
          <a href="/contact" className="text-brand hover:underline">
            Contact our support team
          </a>
          .
        </p>
      </div>
    </main>
  );
}
