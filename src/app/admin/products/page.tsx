"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
  isPublished: boolean;
  images: { url: string; isThumbnail?: boolean }[];
}

interface ListResponse {
  data: AdminProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAuthorized =
    isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        const data: ListResponse = json.data;
        setProducts(data.data);
        setTotalPages(data.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (isAuthorized) loadProducts();
  }, [isAuthorized, loadProducts]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to delete product.");
        return;
      }

      toast.success("Product deleted.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Manage Products
          </h1>
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-brand px-4 py-2 font-semibold text-white transition hover:opacity-90"
          >
            + Add Product
          </Link>
        </div>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="mb-4 w-full max-w-sm rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
        />

        {isLoading ? (
          <Loader size="lg" />
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const thumb =
                    p.images.find((img) => img.isThumbnail)?.url ??
                    p.images[0]?.url;

                  return (
                    <tr key={p.id} className="border-t">
                      <td className="flex items-center gap-3 p-3">
                        {thumb && (
                          <Image
                            src={thumb}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {p.name}
                        </span>
                      </td>
                      <td className="p-3">
                        ₹{p.sellingPrice}{" "}
                        <span className="text-gray-400 line-through">
                          ₹{p.mrp}
                        </span>
                      </td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            p.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="mr-3 font-medium text-brand hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === p.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
