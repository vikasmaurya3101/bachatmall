import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500">
      <div className="mx-auto flex min-h-[500px] max-w-7xl items-center justify-between px-6 py-16">

        <div className="max-w-2xl text-white">

          <p className="mb-4 rounded-full bg-white/20 px-4 py-2 inline-block">
            🇮🇳 India's Smart Marketplace
          </p>

          <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
            Shop Smarter.
            <br />
            Save Bigger.
          </h1>

          <p className="mt-6 text-lg text-green-50">
            Discover thousands of products from trusted sellers
            across India at unbeatable prices.
          </p>

          <div className="mt-10 flex gap-4">
            <Button>
              Shop Now
            </Button>

            <Button variant="outline">
              Become Seller
            </Button>
          </div>

        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="flex h-96 w-96 items-center justify-center rounded-full bg-white/20 text-9xl backdrop-blur">
            🛍️
          </div>
        </div>

      </div>
    </section>
  );
}