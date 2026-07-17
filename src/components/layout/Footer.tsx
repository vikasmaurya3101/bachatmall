import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">

        <div>

          <h2 className="mb-4 text-2xl font-bold text-green-600">
            BachatMall
          </h2>

          <p className="text-sm text-gray-600">
            India's trusted multi-vendor marketplace.
            Shop smarter. Save more.
          </p>

        </div>

        <div>

          <h3 className="mb-3 font-semibold">
            Company
          </h3>

          <div className="space-y-2 text-sm">

            <Link href="/">About Us</Link>

            <br />

            <Link href="/">Contact</Link>

            <br />

            <Link href="/">Careers</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-3 font-semibold">
            Customer
          </h3>

          <div className="space-y-2 text-sm">

            <Link href="/">Help Center</Link>

            <br />

            <Link href="/">Return Policy</Link>

            <br />

            <Link href="/">Terms</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-3 font-semibold">
            Follow Us
          </h3>

          <p className="text-sm text-gray-600">
            Facebook
            <br />
            Instagram
            <br />
            YouTube
          </p>

        </div>

      </div>

      <div className="border-t py-5 text-center text-sm text-gray-500">

        © {new Date().getFullYear()} BachatMall.
        All Rights Reserved.

      </div>

    </footer>
  );
}