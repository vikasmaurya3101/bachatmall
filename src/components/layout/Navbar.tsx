"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useSession } from "@/providers/SessionProvider";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated } = useSession();
  const { itemCount } = useCart();
  const { logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-2xl font-extrabold text-brand">
            BachatMall
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 px-10 lg:block"
          >
            <div className="relative flex items-center">
              <Search
                size={20}
                className="absolute left-4 text-gray-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-28 outline-none transition focus:border-brand focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-full bg-brand px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-6 lg:flex">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="font-medium hover:text-brand"
              >
                Logout ({user?.firstName ?? "Account"})
              </button>
            ) : (
              <Link href="/login" className="font-medium hover:text-brand">
                Login
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-2 hover:text-brand"
            >
              <ShoppingCart size={20} />
              Cart
              {itemCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2 hover:text-brand"
            >
              <User size={20} />
              Profile
            </Link>
          </div>

          <button onClick={() => setMobileOpen(true)} className="lg:hidden">
            <Menu size={28} />
          </button>
        </div>

        {/* Persistent search row for mobile/tablet — the form above is desktop-only */}
        <form onSubmit={handleSearch} className="border-t px-4 py-2.5 lg:hidden">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-16 text-sm outline-none transition focus:border-brand focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-1 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40">
          <div className="absolute right-0 h-full w-72 bg-white">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="font-bold text-brand">BachatMall</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={25} />
              </button>
            </div>

            <nav className="flex flex-col">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="border-b p-4 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="border-b p-4 hover:bg-gray-100"
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>

              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="border-b p-4 hover:bg-gray-100"
              >
                Orders
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="border-b p-4 hover:bg-gray-100"
              >
                Profile
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="border-b p-4 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="border-b p-4 hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
