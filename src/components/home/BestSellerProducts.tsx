import { ProductCardData } from "@/types/product";
import ProductRail from "./ProductRail";

export default function BestSellerProducts({
  products,
}: {
  products: ProductCardData[];
}) {
  return (
    <ProductRail
      title="Best Sellers"
      subtitle="Most loved by BachatMall customers"
      products={products}
      viewAllHref="/search?bestSeller=true"
    />
  );
}
