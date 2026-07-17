"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          {/* Logo */}

          <Link
            href="/"
            className="text-2xl font-bold text-green-600"
          >
            BachatMall
          </Link>

          {/* Desktop Search */}

          <div className="hidden flex-1 px-10 lg:block">

            <div className="relative">

              <Search
                size={20}
                className="absolute left-4 top-3 text-gray-400"
              />

              <input
                placeholder="Search for products..."
                className="
                w-full
                rounded-lg
                border
                py-2.5
                pl-11
                pr-4
                outline-none
                focus:border-green-600
              "
              />

            </div>

          </div>

          {/* Desktop Menu */}

          <div className="hidden items-center gap-6 lg:flex">

            <button className="font-medium hover:text-green-600">
              Login
            </button>

            <button className="flex items-center gap-2 hover:text-green-600">

              <ShoppingCart size={20} />

              Cart

            </button>

            <button className="flex items-center gap-2 hover:text-green-600">

              <User size={20} />

              Profile

            </button>

          </div>

          {/* Mobile */}

          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="lg:hidden"
          >
            <Menu size={28} />
          </button>

        </div>

      </header>

      {/* Mobile Drawer */}

      {mobileOpen && (

        <div className="fixed inset-0 z-[999] bg-black/40">

          <div className="absolute right-0 h-full w-72 bg-white">

            <div className="flex items-center justify-between border-b p-5">

              <h2 className="font-bold text-green-600">
                BachatMall
              </h2>

              <button
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <X size={25} />
              </button>

            </div>

            <nav className="flex flex-col">

              <Link
                href="/"
                className="border-b p-4 hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                href="/search"
                className="border-b p-4 hover:bg-gray-100"
              >
                Search
              </Link>

              <Link
                href="/cart"
                className="border-b p-4 hover:bg-gray-100"
              >
                Cart
              </Link>

              <Link
                href="/profile"
                className="border-b p-4 hover:bg-gray-100"
              >
                Profile
              </Link>

            </nav>

          </div>

        </div>

      )}
    </>
  );
}