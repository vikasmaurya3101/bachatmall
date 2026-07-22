"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useSession } from "@/providers/SessionProvider";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/shared/Logo";

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
      <header className="sticky top-0 z-50 border-b bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo size={38} />

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
                className="tap-shrink absolute right-1.5 rounded-full bg-brand px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-6 lg:flex">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="tap-shrink font-medium transition hover:text-brand"
              >
                Logout ({user?.firstName ?? "Account"})
              </button>
            ) : (
              <Link href="/login" className="font-medium transition hover:text-brand">
                Login
              </Link>
            )}

            <Link
              href="/cart"
              className="tap-shrink relative flex items-center gap-2 transition hover:text-brand"
            >
              <ShoppingCart size={20} />
              Cart
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link
              href="/profile"
              className="tap-shrink flex items-center gap-2 transition hover:text-brand"
            >
              <User size={20} />
              Profile
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="tap-shrink lg:hidden"
            aria-label="Open menu"
          >
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
              className="tap-shrink absolute right-1 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] bg-black/40"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute right-0 h-full w-72 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-5">
                <Logo size={32} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="tap-shrink"
                  aria-label="Close menu"
                >
                  <X size={25} />
                </button>
              </div>

              <nav className="flex flex-col">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b p-4 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  Home
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b p-4 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-brand" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b p-4 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <Package size={18} className="text-brand" />
                    Orders
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b p-4 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <User size={18} className="text-brand" />
                    Profile
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 border-b p-4 text-left text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b p-4 font-semibold text-brand transition hover:bg-brand-50"
                  >
                    Login / Sign up
                    <ChevronRight size={16} />
                  </Link>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
