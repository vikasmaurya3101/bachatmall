import ProductCard from "./ProductCard";

const products = Array.from({ length: 8 }).map(
  (_, i) => ({
    id: String(i),
    name: `Premium Product ${i + 1}`,
    seller: "BachatMall Seller",
    price: 999 + i * 250,
    originalPrice: 1499 + i * 250,
    rating: 4.6,
  })
);

export default function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <button className="font-semibold text-green-600">
          View All
        </button>

      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            {...product}
          />

        ))}

      </div>

    </section>
  );
}