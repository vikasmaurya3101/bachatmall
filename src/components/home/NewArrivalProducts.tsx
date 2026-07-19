import { ProductCardData } from "@/types/product";
import ProductRail from "./ProductRail";

export default function NewArrivalProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <ProductRail
      title="New Arrivals"
      subtitle="Fresh off the shelf"
      products={products}
      viewAllHref="/search?newArrival=true"
    />
  );
}
