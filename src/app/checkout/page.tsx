"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { useCart } from "@/hooks/useCart";
import { AddressData } from "@/types/order";
import { formatCurrency } from "@/lib/utils/currency";
import Loader from "@/components/ui/Loader";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isSessionLoading, user } = useSession();
  const { cart, isLoading: isCartLoading } = useCart();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">(
    "COD"
  );

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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isLocating, setIsLocating] = useState(false);

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
      body: JSON.stringify({
        ...form,
        isDefault: addresses.length === 0,
        latitude: coords?.lat,
        longitude: coords?.lng,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      toast.error(json.message ?? "Unable to save address.");
      return;
    }

    setAddresses((prev) => [json.data, ...prev]);
    setSelectedId(json.data.id);
    setShowForm(false);
    setCoords(null);
    toast.success("Address saved");
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Your browser doesn't support location access.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        try {
          const res = await fetch(
            `/api/geocode/reverse?lat=${lat}&lng=${lng}`
          );
          const json = await res.json();

          if (json.success) {
            setForm((prev) => ({
              ...prev,
              area: json.data.area || prev.area,
              city: json.data.city || prev.city,
              state: json.data.state || prev.state,
              pincode: json.data.pincode || prev.pincode,
            }));
            toast.success("We've filled in your area, city, state, and pincode.");
          } else {
            toast.success("Location added — please fill in the rest below.");
          }
        } catch {
          toast.success("Location added — please fill in the rest below.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error(
          "Couldn't access your location. You can still enter your address manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleClearLocation() {
    setCoords(null);
    toast("Location removed. You can still fill in your address manually.");
  }

  async function finalizeOrder(payload: Record<string, unknown>) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!json.success) {
      toast.error(json.message ?? "Unable to place order.");
      return false;
    }

    toast.success("Order placed successfully!");
    router.push(`/orders/${json.data.id}`);
    return true;
  }

  async function handlePlaceOrderCod() {
    setIsPlacingOrder(true);
    try {
      await finalizeOrder({ addressId: selectedId, paymentMethod: "COD" });
    } finally {
      setIsPlacingOrder(false);
    }
  }

  async function handlePayWithRazorpay() {
    setIsPlacingOrder(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Couldn't load Razorpay. Check your connection and try again.");
        return;
      }

      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
      });
      const orderJson = await orderRes.json();

      if (!orderJson.success) {
        toast.error(orderJson.message ?? "Unable to start payment.");
        return;
      }

      const selectedAddress = addresses.find((a) => a.id === selectedId);
      const { orderId, amount, currency, keyId } = orderJson.data;

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "BachatMall",
        description: "Order payment",
        image: "/brand/logo-128.png",
        prefill: {
          name: selectedAddress?.fullName ?? user?.firstName ?? "",
          contact: selectedAddress?.phone ?? user?.phone ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#d6266f" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          await finalizeOrder({
            addressId: selectedId,
            paymentMethod: "RAZORPAY",
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
          },
        },
      });

      razorpay.open();
    } catch {
      toast.error("Unable to start payment. Please try again.");
      setIsPlacingOrder(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedId) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (paymentMethod === "RAZORPAY") {
      await handlePayWithRazorpay();
    } else {
      await handlePlaceOrderCod();
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
                  {!coords ? (
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-100 bg-brand-50/40 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-50 disabled:opacity-60 sm:col-span-2"
                    >
                      📍 {isLocating ? "Detecting your location..." : "Use my current location"}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-brand-100 bg-brand-50/40 px-4 py-2.5 sm:col-span-2">
                      <span className="text-sm font-semibold text-brand-dark">
                        📍 Delivering near your current location
                      </span>
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocating}
                          className="text-brand hover:underline disabled:opacity-60"
                        >
                          {isLocating ? "Updating..." : "Update"}
                        </button>
                        <button
                          type="button"
                          onClick={handleClearLocation}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
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

                  {coords && (
                    <p className="-mt-1 text-xs text-gray-400 sm:col-span-2">
                      Area, city, state &amp; pincode below were filled in
                      automatically — edit any of them if needed.
                    </p>
                  )}

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
              <div className="flex justify-between border-t pt-2 font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500">
                Payment Method
              </p>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  paymentMethod === "COD"
                    ? "border-brand bg-brand-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  paymentMethod === "RAZORPAY"
                    ? "border-brand bg-brand-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />
                <div>
                  <p className="font-medium text-gray-800">Pay Online</p>
                  <p className="text-xs text-gray-500">
                    UPI, Cards, Netbanking &amp; wallets via Razorpay
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedId}
              className="tap-shrink mt-5 w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {isPlacingOrder
                ? "Processing..."
                : paymentMethod === "RAZORPAY"
                ? "Pay & Place Order"
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
