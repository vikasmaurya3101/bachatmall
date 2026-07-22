import { Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | BachatMall",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Get in Touch
        </h1>

        <p className="mt-4 text-gray-600">
          Questions about an order, a product, or anything else — we&apos;re
          happy to help.
        </p>

        <div className="mt-8 space-y-4">
          <a
            href="mailto:bachatmall.24@gmail.com"
            className="flex items-center gap-4 rounded-xl border bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
              <Mail size={20} className="text-brand" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Email us</p>
              <p className="text-sm text-gray-500">bachatmall.24@gmail.com</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-xl border bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
              <MapPin size={20} className="text-brand" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Based in India</p>
              <p className="text-sm text-gray-500">
                Serving customers pan-India
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Phone &amp; WhatsApp support coming soon.
        </p>
      </div>
    </main>
  );
}
