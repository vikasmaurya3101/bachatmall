import ProductCard from "./ProductCard";

const flashProducts = Array.from({ length: 4 }).map(
  (_, i) => ({
    id: String(i),
    name: `Flash Deal ${i + 1}`,
    seller: "Flash Seller",
    price: 599 + i * 100,
    originalPrice: 999 + i * 150,
    rating: 4.8,
  })
);

export default function FlashSale() {
  return (
    <section className="bg-red-50 py-16">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold text-red-600">

              ⚡ Flash Sale

            </h2>

            <p className="mt-2 text-gray-600">

              Limited time offers. Grab them before they are gone.

            </p>

          </div>

          <button className="font-semibold text-red-600">
            View All
          </button>

        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {flashProducts.map((product) => (

            <ProductCard
              key={product.id}
              {...product}
            />

          ))}

        </div>

      </div>

    </section>
  );
}