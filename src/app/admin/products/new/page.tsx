"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";

interface Category {
  id: string;
  name: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();

  const isAuthorized =
    isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

  const [categories, setCategories] = useState<Category[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [isFetchingLink, setIsFetchingLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sku: "",
    categoryId: "",
    mrp: "",
    sellingPrice: "",
    stock: "10",
    imageUrl: "",
    isPublished: false,
  });

  useEffect(() => {
    if (!isAuthorized) return;

    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      });
  }, [isAuthorized]);

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFetchFromLink() {
    if (!linkUrl.trim()) {
      toast.error("Paste a product link first.");
      return;
    }

    setIsFetchingLink(true);

    try {
      const res = await fetch("/api/admin/products/scrape-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl.trim() }),
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Couldn't read that link.");
        return;
      }

      const { name, description, imageUrl, price } = json.data;

      if (!name && !description && !imageUrl && !price) {
        toast.error(
          "That site blocked the fetch — fill the details manually below."
        );
        return;
      }

      setForm((prev) => ({
        ...prev,
        name: name ?? prev.name,
        slug: name ? slugify(name) : prev.slug,
        description: description ?? prev.description,
        imageUrl: imageUrl ?? prev.imageUrl,
        mrp: price ? String(price) : prev.mrp,
        sellingPrice: price ? String(price) : prev.sellingPrice,
      }));

      toast.success("Fetched what we could — check every field before saving.");
    } finally {
      setIsFetchingLink(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name ||
      !form.slug ||
      !form.description ||
      !form.sku ||
      !form.categoryId ||
      !form.mrp ||
      !form.sellingPrice
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          sku: form.sku,
          categoryId: form.categoryId,
          mrp: Number(form.mrp),
          sellingPrice: Number(form.sellingPrice),
          stock: Number(form.stock),
          isPublished: form.isPublished,
          images: form.imageUrl
            ? [{ url: form.imageUrl, isThumbnail: true, displayOrder: 0 }]
            : [],
        }),
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to create product.");
        return;
      }

      toast.success("Product created.");
      router.push("/admin/products");
    } finally {
      setIsSaving(false);
    }
  }

  if (isSessionLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">
          You don&apos;t have access to this page.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Add Product
        </h1>

        <div className="mb-6 rounded-xl border bg-white p-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Import from a product link (Amazon, Flipkart, etc.)
          </label>
          <div className="flex gap-2">
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://www.amazon.in/..."
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={handleFetchFromLink}
              disabled={isFetchingLink}
              className="whitespace-nowrap rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isFetchingLink ? "Fetching..." : "Fetch Details"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Big sites often block automated fetching — if nothing comes
            through, just fill the form below by hand.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-5"
        >
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="h-40 w-40 rounded-lg border object-cover"
            />
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => {
                updateField("name", e.target.value);
                updateField("slug", slugify(e.target.value));
              }}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                MRP *
              </label>
              <input
                type="number"
                value={form.mrp}
                onChange={(e) => updateField("mrp", e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Selling Price *
              </label>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => updateField("sellingPrice", e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => updateField("isPublished", e.target.checked)}
            />
            Publish immediately (visible to customers)
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-xl bg-brand py-3 font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
