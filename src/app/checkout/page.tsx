"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { useCart } from "@/hooks/useCart";
import { AddressData } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();
  const { cart, isLoading: isCartLoading } = useCart();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    houseNumber: "",
    apartment: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingAddresses(false);
      return;
    }

    fetch("/api/addresses")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setAddresses(json.data);
          const defaultAddr = json.data.find(
            (a: AddressData) => a.isDefault
          );
          setSelectedId(defaultAddr?.id ?? json.data[0]?.id ?? null);
          if (json.data.length === 0) setShowForm(true);
        }
      })
      .finally(() => setIsLoadingAddresses(false));
  }, [isAuthenticated]);

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isDefault: addresses.length === 0 }),
    });

    const json = await res.json();

    if (!json.success) {
      toast.error(json.message ?? "Unable to save address.");
      return;
    }

    setAddresses((prev) => [json.data, ...prev]);
    setSelectedId(json.data.id);
    setShowForm(false);
    toast.success("Address saved");
  }

  async function handlePlaceOrder() {
    if (!selectedId) {
      toast.error("Please select a delivery address.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedId,
          paymentMethod: "COD",
        }),
      });

      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to place order.");
        return;
      }

      toast.success("Order placed successfully!");
      router.push(`/orders/${json.data.id}`);
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (isSessionLoading || isCartLoading || isLoadingAddresses) {
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
          Please login to proceed to checkout.
        </p>
      </main>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      </main>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.sellingPrice) * item.quantity,
    0
  );
  const shipping = subtotal >= 499 ? 0 : 49;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Checkout
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl border bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowForm((prev) => !prev)}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  {showForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {!showForm && (
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                        selectedId === address.id
                          ? "border-brand bg-brand-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedId === address.id}
                        onChange={() => setSelectedId(address.id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">
                          {address.fullName} · {address.phone}
                        </p>
                        <p className="text-gray-600">
                          {address.completeAddress}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showForm && (
                <form onSubmit={handleAddAddress} className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
                  />
                  <input
                    required
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />
                  <input
                    required
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />
                  <input
                    required
                    placeholder="House / Flat No."
                    value={form.houseNumber}
                    onChange={(e) =>
                      setForm({ ...form, houseNumber: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />
                  <input
                    placeholder="Apartment / Building (optional)"
                    value={form.apartment}
                    onChange={(e) =>
                      setForm({ ...form, apartment: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />
                  <input
                    required
                    placeholder="Area / Street"
                    value={form.area}
                    onChange={(e) =>
                      setForm({ ...form, area: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
                  />
                  <input
                    placeholder="Landmark (optional)"
                    value={form.landmark}
                    onChange={(e) =>
                      setForm({ ...form, landmark: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
                  />
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />
                  <input
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
                  />

                  <button
                    type="submit"
                    className="rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark sm:col-span-2"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>

            <div className="rounded-xl border bg-white p-5">
              <h2 className="mb-3 font-semibold text-gray-800">
                Order Items ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        Number(item.product.sellingPrice) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-fit rounded-xl border bg-white p-5">
            <h2 className="mb-4 font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(subtotal + shipping)}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Payment method: Cash on Delivery
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedId}
              className="mt-5 w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
