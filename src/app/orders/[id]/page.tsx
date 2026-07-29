"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { OrderData } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

const RETURN_WINDOW_DAYS = 3;
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING"];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
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
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleCancel() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${params.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() || undefined }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message ?? "Unable to cancel order.");
        return;
      }
      setOrder(json.data);
      setShowCancelForm(false);
      setReason("");
      toast.success("Order cancelled.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReturn() {
    if (!reason.trim()) {
      toast.error("Please tell us why you're returning this order.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${params.id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message ?? "Unable to request return.");
        return;
      }
      setOrder(json.data);
      setShowReturnForm(false);
      setReason("");
      toast.success("Return requested. We'll be in touch shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

  const canCancel = CANCELLABLE_STATUSES.includes(order.orderStatus);

  const daysSinceDelivery = order.deliveredAt
    ? (Date.now() - new Date(order.deliveredAt).getTime()) /
      (1000 * 60 * 60 * 24)
    : null;

  const canReturn =
    order.orderStatus === "DELIVERED" &&
    daysSinceDelivery !== null &&
    daysSinceDelivery <= RETURN_WINDOW_DAYS;

  const returnWindowExpired =
    order.orderStatus === "DELIVERED" &&
    daysSinceDelivery !== null &&
    daysSinceDelivery > RETURN_WINDOW_DAYS;

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

          {order.orderStatus === "CANCELLED" && order.cancelReason && (
            <p className="mt-3 text-sm text-gray-500">
              Cancellation reason: {order.cancelReason}
            </p>
          )}
          {order.orderStatus === "RETURNED" && order.returnReason && (
            <p className="mt-3 text-sm text-gray-500">
              Return reason: {order.returnReason}
            </p>
          )}
          {returnWindowExpired && (
            <p className="mt-3 text-xs text-gray-400">
              The {RETURN_WINDOW_DAYS}-day return window for this order has
              passed.
            </p>
          )}

          {(canCancel || canReturn) && !showCancelForm && !showReturnForm && (
            <div className="mt-4 flex flex-wrap gap-3">
              {canCancel && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="rounded-xl border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Cancel Order
                </button>
              )}
              {canReturn && (
                <button
                  onClick={() => setShowReturnForm(true)}
                  className="rounded-xl border-2 border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-50"
                >
                  Return Order
                </button>
              )}
            </div>
          )}

          {showCancelForm && (
            <div className="mt-4 rounded-lg border bg-gray-50 p-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Why are you cancelling?"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
                </button>
                <button
                  onClick={() => {
                    setShowCancelForm(false);
                    setReason("");
                  }}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {showReturnForm && (
            <div className="mt-4 rounded-lg border bg-gray-50 p-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Reason for return (required)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="What's wrong with the product?"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleReturn}
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Return"}
                </button>
                <button
                  onClick={() => {
                    setShowReturnForm(false);
                    setReason("");
                  }}
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}
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
          {order.address.latitude && order.address.longitude && (
            <a
              href={`https://www.google.com/maps?q=${order.address.latitude},${order.address.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
            >
              View exact drop location on map →
            </a>
          )}
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
