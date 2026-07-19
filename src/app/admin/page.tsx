"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";

interface DashboardData {
  stats: {
    totalProducts: number;
    publishedProducts?: number;
    outOfStock?: number;
    lowStock?: number;
  };
  lowStock: { id: string; name: string; stock: number }[];
  outOfStock: { id: string; name: string }[];
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized =
    isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

  useEffect(() => {
    if (!isAuthorized) {
      setIsLoading(false);
      return;
    }

    fetch("/api/products/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message ?? "Unable to load dashboard.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [isAuthorized]);

  if (isSessionLoading || isLoading) {
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
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          {user?.role === "ADMIN" ? "Admin Dashboard" : "Seller Dashboard"}
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {data.stats.totalProducts}
                </p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">Published</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {data.stats.publishedProducts ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">
                  {data.lowStock.length}
                </p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {data.outOfStock.length}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">
                  Low Stock Alerts
                </h2>
                {data.lowStock.length === 0 ? (
                  <p className="text-sm text-gray-500">All good here.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {data.lowStock.map((p) => (
                      <li key={p.id} className="flex justify-between">
                        <span className="text-gray-700">{p.name}</span>
                        <span className="font-medium text-amber-600">
                          {p.stock} left
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border bg-white p-5">
                <h2 className="mb-3 font-semibold text-gray-800">
                  Out of Stock
                </h2>
                {data.outOfStock.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nothing out of stock.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {data.outOfStock.map((p) => (
                      <li key={p.id} className="text-gray-700">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
