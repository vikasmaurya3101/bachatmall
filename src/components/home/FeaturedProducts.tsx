import { ProductCardData } from "@/types/product";
import ProductRail from "./ProductRail";

export default function FeaturedProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <ProductRail
      title="Featured Products"
      subtitle="Handpicked just for you"
      products={products}
      viewAllHref="/search?featured=true"
    />
  );
}
