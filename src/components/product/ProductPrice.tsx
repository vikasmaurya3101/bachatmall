import { formatCurrency } from "@/lib/utils/currency";
import { hasDiscount } from "@/lib/utils/discount";

interface ProductPriceProps {
  mrp: number | string;
  sellingPrice: number | string;
  discountPercent?: number | string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { price: "text-sm", mrp: "text-xs", badge: "text-[10px]" },
  md: { price: "text-lg", mrp: "text-sm", badge: "text-xs" },
  lg: { price: "text-2xl", mrp: "text-base", badge: "text-sm" },
};

export default function ProductPrice({
  mrp,
  sellingPrice,
  discountPercent,
  size = "md",
}: ProductPriceProps) {
  const classes = sizeClasses[size];
  const showDiscount = hasDiscount(Number(mrp), Number(sellingPrice));

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-bold text-gray-900 ${classes.price}`}>
        {formatCurrency(sellingPrice)}
      </span>

      {showDiscount && (
        <span className={`text-gray-400 line-through ${classes.mrp}`}>
          {formatCurrency(mrp)}
        </span>
      )}

      {showDiscount && discountPercent !== undefined && (
        <span
          className={`font-semibold text-brand ${classes.badge}`}
        >
          {Math.round(Number(discountPercent))}% off
        </span>
      )}
    </div>
  );
}
