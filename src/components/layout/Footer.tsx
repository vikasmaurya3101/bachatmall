import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">

        <div>

          <h2 className="mb-4 text-2xl font-extrabold text-brand">
            BachatMall
          </h2>

          <p className="text-sm text-gray-600">
            Sabse Sasta, Yahi Milega — unbeatable prices on
            quality products, delivered fast.
          </p>

        </div>

        <div>

          <h3 className="mb-3 font-semibold">
            Company
          </h3>

          <div className="space-y-2 text-sm">

            <Link href="/about">About Us</Link>

            <br />

            <Link href="/contact">Contact</Link>

            <br />

            <Link href="/careers">Careers</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-3 font-semibold">
            Customer
          </h3>

          <div className="space-y-2 text-sm">

            <Link href="/help">Help Center</Link>

            <br />

            <Link href="/returns">Return Policy</Link>

            <br />

            <Link href="/terms">Terms</Link>

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