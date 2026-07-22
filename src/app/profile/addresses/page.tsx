"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Check,
  Home,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useSession } from "@/providers/SessionProvider";
import { AddressData, AddressType } from "@/types/order";
import Loader from "@/components/ui/Loader";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  houseNumber: "",
  apartment: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  type: "HOME" as AddressType,
};

const TYPE_ICON: Record<AddressType, typeof Home> = {
  HOME: Home,
  WORK: Briefcase,
  OTHER: MapPin,
};

export default function SavedAddressesPage() {
  const { isAuthenticated, isLoading } = useSession();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingList(false);
      return;
    }

    fetch("/api/addresses")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAddresses(json.data);
      })
      .finally(() => setLoadingList(false));
  }, [isAuthenticated]);

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setCoords(null);
    setShowForm(true);
  }

  function openEditForm(address: AddressData) {
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      houseNumber: address.houseNumber,
      apartment: address.apartment ?? "",
      area: address.area,
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
    });
    setEditingId(address.id);
    setCoords(
      address.latitude && address.longitude
        ? { lat: address.latitude, lng: address.longitude }
        : null
    );
    setMenuOpenId(null);
    setShowForm(true);
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
          const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
          const json = await res.json();

          if (json.success) {
            setForm((prev) => ({
              ...prev,
              area: json.data.area || prev.area,
              city: json.data.city || prev.city,
              state: json.data.state || prev.state,
              pincode: json.data.pincode || prev.pincode,
            }));
            toast.success("Filled in your area, city, state, and pincode.");
          }
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Couldn't access your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        latitude: coords?.lat,
        longitude: coords?.lng,
      };

      const res = await fetch(
        editingId ? `/api/addresses/${editingId}` : "/api/addresses",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Unable to save address.");
        return;
      }

      if (editingId) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? json.data : a))
        );
        toast.success("Address updated");
      } else {
        setAddresses((prev) => [json.data, ...prev]);
        toast.success("Address added");
      }

      setShowForm(false);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault(address: AddressData) {
    setMenuOpenId(null);

    const res = await fetch(`/api/addresses/${address.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });

    const json = await res.json();

    if (json.success) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === address.id }))
      );
      toast.success("Default address updated");
    } else {
      toast.error(json.message ?? "Unable to update.");
    }
  }

  async function handleDelete(id: string) {
    setMenuOpenId(null);

    const prev = addresses;
    setAddresses((cur) => cur.filter((a) => a.id !== id));

    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    const json = await res.json();

    if (!json.success) {
      setAddresses(prev);
      toast.error(json.message ?? "Unable to delete address.");
    } else {
      toast.success("Address removed");
    }
  }

  if (isLoading || loadingList) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Login to manage addresses
        </h1>
        <Link
          href="/login?redirect=/profile/addresses"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/profile"
            className="tap-shrink flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Saved Addresses</h1>
        </div>

        {!showForm && (
          <button
            onClick={openAddForm}
            className="tap-shrink mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-100 bg-brand-50/40 py-3.5 font-semibold text-brand transition hover:bg-brand-50"
          >
            <Plus size={18} />
            Add New Address
          </button>
        )}

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSave}
              className="mb-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2"
            >
              <h2 className="font-semibold text-gray-800 sm:col-span-2">
                {editingId ? "Edit Address" : "New Address"}
              </h2>

              {!coords ? (
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="tap-shrink flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-100 bg-brand-50/40 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-50 disabled:opacity-60 sm:col-span-2"
                >
                  📍 {isLocating ? "Detecting your location..." : "Use my current location"}
                </button>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg border-2 border-brand-100 bg-brand-50/40 px-4 py-2.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-brand-dark">
                    📍 Location added
                  </span>
                  <button
                    type="button"
                    onClick={() => setCoords(null)}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="flex gap-2 sm:col-span-2">
                {(["HOME", "WORK", "OTHER"] as AddressType[]).map((t) => {
                  const Icon = TYPE_ICON[t];
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`tap-shrink flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        form.type === t
                          ? "border-brand bg-brand text-white"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={13} />
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>

              <input
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
              />
              <input
                required
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
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
                onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
              />
              <input
                required
                placeholder="Area / Street"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
              />
              <input
                placeholder="Landmark (optional)"
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
              />
              <input
                required
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="rounded-lg border px-3 py-2 outline-none focus:border-brand"
              />

              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="tap-shrink flex-1 rounded-lg border py-2.5 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="tap-shrink flex-1 rounded-lg bg-brand py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.form>
          ) : addresses.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border bg-white p-8 text-center"
            >
              <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">
                No addresses saved yet. Add one to speed up checkout.
              </p>
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-3">
              {addresses.map((address) => {
                const Icon = TYPE_ICON[address.type];
                return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative rounded-xl border bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-gray-800">
                            {address.fullName}
                          </p>
                          {address.isDefault && (
                            <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                              <Star size={10} fill="currentColor" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {address.phone}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {address.completeAddress}
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setMenuOpenId(
                              menuOpenId === address.id ? null : address.id
                            )
                          }
                          className="tap-shrink rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                          aria-label="Address options"
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {menuOpenId === address.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-lg border bg-white shadow-lg"
                            >
                              <button
                                onClick={() => openEditForm(address)}
                                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(address)}
                                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Check size={14} /> Set as default
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(address.id)}
                                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
