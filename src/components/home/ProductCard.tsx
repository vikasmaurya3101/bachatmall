import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice: number;
  image?: string;
  seller: string;
  rating: number;
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  seller,
  rating,
}: ProductCardProps) {
  const discount = Math.round(
    ((originalPrice - price) / originalPrice) * 100
  );

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-1 hover:shadow-xl">

      <div className="relative">

        <button className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow">

          <Heart size={18} />

        </button>

        <div className="flex h-60 items-center justify-center bg-gray-100 text-7xl">

          📦

        </div>

      </div>

      <div className="space-y-3 p-5">

        <h3 className="line-clamp-2 font-semibold">
          {name}
        </h3>

        <p className="text-sm text-gray-500">
          {seller}
        </p>

        <div className="flex items-center gap-2">

          <div className="flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs text-white">

            <Star size={12} fill="white" />

            {rating}

          </div>

          <span className="text-sm text-gray-500">
            (124)
          </span>

        </div>

        <div className="flex items-center gap-3">

          <span className="text-2xl font-bold text-green-600">

            ₹{price}

          </span>

          <span className="text-gray-400 line-through">

            ₹{originalPrice}

          </span>

          <span className="font-semibold text-red-600">

            {discount}% OFF

          </span>

        </div>

        <Button
          fullWidth
        >
          <div className="flex items-center justify-center gap-2">

            <ShoppingCart size={18} />

            Add to Cart

          </div>
        </Button>

      </div>

    </div>
  );
}