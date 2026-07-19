import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden brand-gradient py-16 text-white sm:py-24">
      {/* Decorative blurred blobs — signature element */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
          <Sparkles size={14} className="fill-gold text-gold" />
          UP TO 80% OFF · TODAY ONLY
        </span>

        <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Sabse Sasta,
          <br />
          Yahi Milega.
        </h1>

        <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
          Unbeatable prices, handpicked quality, and fast delivery —
          straight to your door, every single day.
        </p>

        <Link
          href="/search"
          className="brand-glow mt-10 inline-block rounded-full bg-white px-9 py-3.5 font-bold text-brand-dark transition hover:scale-[1.03] hover:bg-brand-50"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
