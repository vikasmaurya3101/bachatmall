"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Zap,
  Image as ImageIcon,
  LayoutGrid,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useSession } from "@/providers/SessionProvider";

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata: { orderId?: string } | null;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const NAV_LINKS = [
  { href: "/admin",            label: "Dashboard",   icon: LayoutDashboard, exact: true },
  { href: "/admin/orders",     label: "Orders",       icon: ShoppingCart },
  { href: "/admin/products",   label: "Products",     icon: Package },
  { href: "/admin/catalog",    label: "Catalog",      icon: Tag },
  { href: "/admin/flash-sale", label: "Flash Sale",   icon: Zap },
  { href: "/admin/banners",    label: "Banners",      icon: ImageIcon },
  { href: "/admin/sections",   label: "Sections",     icon: LayoutGrid },
];

export default function AdminSidebar() {
  const { user, isAuthenticated } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const isSeller = isAuthenticated && user?.role === "SELLER";
  const isAuthorized = isAdmin || isSeller;

  const loadNotifications = useCallback(async () => {
    const res = await fetch("/api/admin/notifications");
    const json = await res.json();
    if (json.success) {
      setNotifications(json.data.notifications);
      setUnreadCount(json.data.unreadCount);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
  }, [isAuthorized, loadNotifications]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleNotifClick(n: NotificationRow) {
    if (!n.isRead) {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      });
      setNotifications((prev) =>
        prev.map((r) => (r.id === n.id ? { ...r, isRead: true } : r))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setNotifOpen(false);
    if (n.metadata?.orderId) router.push(`/admin/orders/${n.metadata.orderId}`);
  }

  async function handleMarkAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  if (!isAuthorized) return null;

  function isActive(link: (typeof NAV_LINKS)[0]) {
    if (link.exact) return pathname === link.href;
    return pathname?.startsWith(link.href);
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
          S
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-tight">Shopka</div>
          <div className="text-xs text-gray-400">Admin Panel</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_LINKS.map((link) => {
          // Sellers only see Dashboard, Orders, Products
          if (isSeller && !isAdmin) {
            if (![ "/admin", "/admin/orders", "/admin/products"].includes(link.href)) return null;
          }
          const active = isActive(link);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand text-xs font-bold uppercase flex-shrink-0">
            {user?.firstName?.[0] ?? user?.email?.[0] ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : (user?.email ?? "Admin")}
            </div>
            <div className="truncate text-xs text-gray-400">{user?.role}</div>
          </div>
          <button
            onClick={() => router.push("/api/auth/logout")}
            className="text-gray-500 hover:text-white transition"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 lg:z-40 bg-gray-900">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-900 transition-transform duration-200 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Top header bar (all screen sizes) ── */}
      <header className="fixed top-0 right-0 left-0 lg:left-56 z-30 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm">
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Page title breadcrumb */}
        <div className="hidden lg:block">
          <span className="text-sm font-semibold text-gray-700">
            {NAV_LINKS.find((l) => isActive(l))?.label ?? "Admin"}
          </span>
        </div>

        {/* Right side: notifications */}
        <div ref={notifRef} className="relative ml-auto">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-xl z-50">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold text-gray-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`block w-full border-b p-3 text-left text-sm last:border-0 hover:bg-gray-50 ${
                        n.isRead ? "" : "bg-brand-50/40"
                      }`}
                    >
                      <div className="font-medium text-gray-800">{n.title}</div>
                      <div className="text-gray-500">{n.message}</div>
                      <div className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
