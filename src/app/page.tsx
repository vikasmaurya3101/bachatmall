export default function HomePage() {
  const categories = [
    "Electronics",
    "Fashion",
    "Mobiles",
    "Home",
    "Beauty",
    "Kitchen",
    "Sports",
    "Books",
  ];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <h1 className="text-2xl font-bold text-green-600">
            BachatMall
          </h1>

          <div className="hidden flex-1 px-10 md:block">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-5">

            <button className="font-medium hover:text-green-600">
              Login
            </button>

            <button className="font-medium hover:text-green-600">
              Cart
            </button>

          </div>

        </div>
      </header>

      {/* Hero */}

      <section className="bg-gradient-to-r from-green-600 to-green-500 py-20 text-white">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="max-w-2xl text-5xl font-bold">
            Save More.
            <br />
            Shop Smarter.
          </h2>

          <p className="mt-6 max-w-xl text-lg">
            India's trusted multi-vendor marketplace.
            Best prices. Fast delivery.
            Thousands of sellers.
          </p>

          <button className="mt-10 rounded-lg bg-white px-8 py-3 font-semibold text-green-700 hover:bg-gray-100">
            Shop Now
          </button>

        </div>

      </section>

      {/* Categories */}

      <section className="mx-auto max-w-7xl