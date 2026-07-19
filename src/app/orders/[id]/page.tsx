"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { OrderData } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setOrder(json.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">Order not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
          Order #{order.invoiceNumber}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Placed on{" "}
          {new Date(order.placedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="mb-4 rounded-xl border bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-800">Status</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
              Order: {order.orderStatus.replace(/_/g, " ")}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
              Payment: {order.paymentStatus}
            </span>
            <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
              Shipment: {order.shipmentStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-xl border bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-800">
            Delivery Address
          </h2>
          <p className="text-sm text-gray-700">
            {order.address.fullName} · {order.address.phone}
          </p>
          <p className="text-sm text-gray-600">
            {order.address.completeAddress}
          </p>
        </div>

        <div className="mb-4 rounded-xl border bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-800">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.productImage && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div className="flex flex-1 justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-3 font-semibold text-gray-800">Price Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
