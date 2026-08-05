import { BadgeCheck, RotateCcw, Truck } from "lucide-react";

const BADGES = [
  {
    icon: RotateCcw,
    title: "Easy",
    subtitle: "Returns",
  },
  {
    icon: BadgeCheck,
    title: "Top Rated",
    subtitle: "Products",
  },
  {
    icon: Truck,
    title: "Cash",
    subtitle: "on Delivery",
  },
];

export default function TrustBadgeStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
      <div className="flex flex-col divide-y divide-gold/30 rounded-3xl border-2 border-gold bg-gradient-to-r from-brand-dark via-brand to-accent-dark px-6 py-5 shadow-lg sm:flex-row sm:divide-x sm:divide-y-0 sm:py-6">
        {BADGES.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title + subtitle}
            className="flex flex-1 items-center justify-center gap-3 py-3 sm:py-0"
          >
            <Icon size={30} className="shrink-0 text-gold" strokeWidth={2} />
            <span className="text-lg font-bold leading-tight text-white sm:text-xl">
              {title}
              <br />
              {subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
