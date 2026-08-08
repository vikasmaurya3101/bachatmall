"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";
import { formatCurrency } from "@/lib/utils/currency";
import { useDebounce } from "@/hooks/useDebounce";

interface OrderRow {
  id: string;
  invoiceNumber: string;
  totalAmount: number | string;
  orderStatus: string;
  paymentStatus: string;
  shipmentStatus: string;
  placedAt: string;
  items: { id: string }[];
  payment: { method: string } | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string | null;
  };
}

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-teal-100 text-teal-700",
};

export default function AdminOrdersPage() {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();
  const isAuthorized =
    isAuthenticated && (user?.role === "ADMIN" || user?.role === "SELLER");

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        status,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data.orders);
        setTotalPages(json.data.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, status, debouncedSearch]);

  useEffect(() => {
    if (isAuthorized) load();
  }, [isAuthorized, load]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

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

  const quickFilters = [
    { key: "ALL", label: "All", color: "" },
    { key: "PENDING", label: "Pending", color: "text-gray-600" },
    { key: "CONFIRMED", label: "Confirmed", color: "text-blue-600" },
    { key: "SHIPPED", label: "Shipped", color: "text-purple-600" },
    { key: "DELIVERED", label: "Delivered", color: "text-green-600" },
    { key: "RETURNED", label: "Returns", color: "text-orange-600" },
    { key: "CANCELLED", label: "Cancelled", color: "text-red-600" },
    { key: "REFUNDED", label: "Refunded", color: "text-teal-600" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Orders
        </h1>

        {/* Quick filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {quickFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                status === f.key
                  ? "bg-brand text-white"
                  : "bg-white border hover:border-brand"
              } ${status !== f.key ? f.color : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, name, phone, email..."
            className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white">
          {isLoading ? (
            <div className="p-8">
              <Loader size="md" />
            </div>
          ) : orders.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No orders found.</p>
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Placed</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3 font-medium text-gray-800">
                      {order.invoiceNumber}
                    </td>
                    <td className="p-3">
                      <div className="text-gray-800">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user.phone}
                      </div>
                    </td>
                    <td className="p-3">{order.items.length}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="p-3">
                      <div>{order.payment?.method ?? "-"}</div>
                      <div className="text-xs text-gray-400">
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          STATUS_COLORS[order.orderStatus] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {new Date(order.placedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 py-1.5 text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
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
