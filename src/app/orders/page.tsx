"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";
import { OrderData } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-success-light text-success",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    fetch("/api/orders")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setOrders(json.data);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">
          Please login to view your orders.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border bg-white p-4 transition hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    #{order.invoiceNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.placedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.items.length} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColors[order.orderStatus] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
