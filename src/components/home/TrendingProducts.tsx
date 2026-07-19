import { ProductCardData } from "@/types/product";
import ProductRail from "./ProductRail";

export default function TrendingProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <ProductRail
      title="Trending Now"
      subtitle="What everyone's buying right now"
      products={products}
      viewAllHref="/search?trending=true"
    />
  );
}
