"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, MapPin, Package, User as UserIcon } from "lucide-react";
import { useSession } from "@/providers/SessionProvider";
import { useAuth } from "@/hooks/useAuth";
import { AddressData } from "@/types/order";
import { getInitials } from "@/lib/utils";
import Loader from "@/components/ui/Loader";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useSession();
  const { logout } = useAuth();
  const [addresses, setAddresses] = useState<AddressData[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/addresses")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setAddresses(json.data);
      });
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Login to view your profile
        </h1>
        <Link
          href="/login?redirect=/profile"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4 rounded-xl border bg-white p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {user.firstName} {user.lastName ?? ""}
            </h1>
            <p className="text-sm text-gray-500">+91 {user.phone}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/orders"
            className="flex items-center gap-3 rounded-xl border bg-white p-5 hover:shadow-md"
          >
            <Package size={22} className="text-brand" />
            <div>
              <p className="font-medium text-gray-800">My Orders</p>
              <p className="text-xs text-gray-500">Track and manage orders</p>
            </div>
          </Link>

          <div className="rounded-xl border bg-white p-5">
            <div className="mb-2 flex items-center gap-3">
              <MapPin size={22} className="text-brand" />
              <p className="font-medium text-gray-800">
                Saved Addresses ({addresses.length})
              </p>
            </div>
            {addresses.length === 0 ? (
              <p className="text-xs text-gray-500">
                No addresses saved yet — add one at checkout.
              </p>
            ) : (
              <p className="text-xs text-gray-500 line-clamp-1">
                {addresses[0].completeAddress}
              </p>
            )}
          </div>

          {(user.role === "SELLER" || user.role === "ADMIN") && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl border bg-white p-5 hover:shadow-md"
            >
              <UserIcon size={22} className="text-brand" />
              <div>
                <p className="font-medium text-gray-800">
                  {user.role === "ADMIN" ? "Admin Dashboard" : "Seller Dashboard"}
                </p>
                <p className="text-xs text-gray-500">Manage products & orders</p>
              </div>
            </Link>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-xl border bg-white p-5 text-left hover:shadow-md"
          >
            <LogOut size={22} className="text-red-500" />
            <p className="font-medium text-gray-800">Logout</p>
          </button>
        </div>
      </div>
    </main>
  );
}
