const categories = [
  { name: "Mobiles", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Electronics", icon: "💻" },
  { name: "Home", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Kitchen", icon: "🍳" },
  { name: "Sports", icon: "⚽" },
  { name: "Books", icon: "📚" },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Shop by Category
        </h2>

        <button className="font-semibold text-green-600">
          View All
        </button>

      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-8">

        {categories.map((category) => (
          <button
            key={category.name}
            className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="text-5xl">
              {category.icon}
            </div>

            <p className="mt-4 font-semibold">
              {category.name}
            </p>
          </button>
        ))}

      </div>

    </section>
  );
}