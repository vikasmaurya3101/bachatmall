"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ShoppingBag, Sparkles, Star, Zap } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

export default function Hero({
  badge    = "UP TO 80% OFF · TODAY ONLY",
  title    = "Smart Shopping\nStarts Here.",
  subtitle = "Unbeatable prices, handpicked quality, and fast delivery — straight to your door, every single day.",
  cta      = "Shop Now",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden brand-gradient py-10 text-white sm:py-16">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-20 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-64 w-64 rounded-full bg-brand-400/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/20 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        {/* ── Left: text ── */}
        <div>
          <motion.span
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur"
          >
            <Sparkles size={13} className="fill-gold text-gold" />
            {badge}
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
            className="mt-3 max-w-lg whitespace-pre-line text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={0.2}
            variants={fadeUp}
            className="mt-3 max-w-md text-sm text-white/85 sm:text-base"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={0.3}
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/search"
              className="brand-glow inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-dark transition hover:scale-[1.03] hover:bg-brand-50"
            >
              {cta}
            </Link>
            <Link
              href="/search"
              className="inline-block rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse All
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={0.4}
            variants={fadeUp}
            className="mt-8 flex gap-8"
          >
            {[
              { val: "50K+",  label: "Products" },
              { val: "2-Day", label: "Delivery"  },
              { val: "4.8★",  label: "Rating"    },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-xl font-extrabold text-gold">{val}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: floating cards (desktop only) ── */}
        <div className="relative hidden h-72 lg:block">
          {/* Central circle */}
          <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm">
            <ShoppingBag size={64} className="text-white/35" strokeWidth={1.4} />
          </div>

          {/* Floating card — Flash Deal */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 top-4 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <Zap size={20} className="fill-gold text-gold" />
            <div>
              <p className="text-[11px] text-white/65">Flash Deal</p>
              <p className="text-sm font-bold text-white">Up to 80% off</p>
            </div>
          </motion.div>

          {/* Floating card — Free Shipping */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute left-2 top-20 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <ShoppingBag size={20} className="text-white" />
            <div>
              <p className="text-[11px] text-white/65">Free Shipping</p>
              <p className="text-sm font-bold text-white">Orders ₹499+</p>
            </div>
          </motion.div>

          {/* Floating card — Trusted */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-4 bottom-2 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <Star size={20} className="fill-gold text-gold" />
            <div>
              <p className="text-[11px] text-white/65">Trusted by</p>
              <p className="text-sm font-bold text-white">10K+ customers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
