"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden brand-gradient py-10 text-white sm:py-14">
      {/* Decorative blurred blobs — signature element */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.span
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur"
        >
          <Sparkles size={14} className="fill-gold text-gold" />
          UP TO 80% OFF · TODAY ONLY
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={0.1}
          variants={fadeUp}
          className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
        >
          Smart Shopping Starts Here.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={0.2}
          variants={fadeUp}
          className="mt-3 max-w-xl text-sm text-white/85 sm:text-base"
        >
          Unbeatable prices, handpicked quality, and fast delivery —
          straight to your door, every single day.
        </motion.p>

        <motion.div initial="hidden" animate="show" custom={0.3} variants={fadeUp}>
          <Link
            href="/search"
            className="brand-glow mt-5 inline-block rounded-full bg-white px-7 py-2.5 text-sm font-bold text-brand-dark transition hover:scale-[1.03] hover:bg-brand-50"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
