"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      // No newsletter backend yet — this can be wired to an
      // /api/newsletter route once one exists.
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Thanks for subscribing!");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="brand-gradient py-12 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Get the best deals in your inbox
        </h2>
        <p className="mt-2 text-white/85">
          Subscribe for exclusive offers and early access to sales.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg px-4 py-3 text-gray-900 outline-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-dark transition hover:bg-brand-50 disabled:opacity-60"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
