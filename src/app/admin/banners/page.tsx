"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import { Loader } from "@/components/ui/Loader";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerPosition = "HOME_TOP" | "HOME_MIDDLE" | "HOME_BOTTOM" | "CATEGORY" | "CHECKOUT";

interface Banner {
  id: string;
  title: string;
  image: string;
  linkUrl: string | null;
  position: BannerPosition;
  displayOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  image: string;
  linkUrl: string;
  position: BannerPosition;
  displayOrder: number;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITION_LABELS: Record<BannerPosition, string> = {
  HOME_TOP: "Home - Top Banner",
  HOME_MIDDLE: "Home - Middle Banner",
  HOME_BOTTOM: "Home - Bottom Banner",
  CATEGORY: "Category Page",
  CHECKOUT: "Checkout Page",
};

const POSITION_TABS: { label: string; value: BannerPosition | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Home Top", value: "HOME_TOP" },
  { label: "Home Middle", value: "HOME_MIDDLE" },
  { label: "Home Bottom", value: "HOME_BOTTOM" },
  { label: "Category", value: "CATEGORY" },
  { label: "Checkout", value: "CHECKOUT" },
];

const DEFAULT_FORM: BannerFormData = {
  title: "",
  image: "",
  linkUrl: "",
  position: "HOME_TOP",
  displayOrder: 0,
  isActive: true,
  startsAt: "",
  endsAt: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BannersPage() {
  const { session, loading: sessionLoading } = useSession();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BannerPosition | "ALL">("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.role === "ADMIN") {
      fetchBanners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  async function fetchBanners() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      } else {
        toast.error(data.message || "Failed to load banners.");
      }
    } catch {
      toast.error("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Image upload ───────────────────────────────────────────────────────────

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded.");
      } else {
        toast.error("Image upload failed.");
      }
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  // ─── Modal helpers ──────────────────────────────────────────────────────────

  function openCreate() {
    setEditingBanner(null);
    setForm(DEFAULT_FORM);
    setModalOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      image: banner.image,
      linkUrl: banner.linkUrl || "",
      position: banner.position,
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
      startsAt: banner.startsAt ? banner.startsAt.slice(0, 16) : "",
      endsAt: banner.endsAt ? banner.endsAt.slice(0, 16) : "",
    });
    setModalOpen(true);
  }

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Image is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder),
        linkUrl: form.linkUrl || null,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      };

      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";
      const method = editingBanner ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingBanner ? "Banner updated." : "Banner created.");
        setModalOpen(false);
        fetchBanners();
      } else {
        toast.error(data.message || "Failed.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(banner: Banner) {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b))
        );
        toast.success(banner.isActive ? "Banner deactivated." : "Banner activated.");
      } else {
        toast.error(data.message || "Failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Banner deleted.");
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } else {
        toast.error(data.message || "Failed.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setDeleteConfirmId(null);
    }
  }

  // ─── Formatting helpers ─────────────────────────────────────────────────────

  function formatDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateRange(banner: Banner): string {
    const start = formatDate(banner.startsAt);
    const end = formatDate(banner.endsAt);
    if (!start && !end) return "Always active";
    if (start && end) return `${start} – ${end}`;
    if (start) return `From ${start}`;
    return `Until ${end}`;
  }

  // ─── Filtered list ──────────────────────────────────────────────────────────

  const filteredBanners =
    activeTab === "ALL" ? banners : banners.filter((b) => b.position === activeTab);

  // ─── Auth guard ─────────────────────────────────────────────────────────────

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!session || session.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">No access.</p>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <Button
          onClick={openCreate}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          + Add Banner
        </Button>
      </div>

      {/* Position filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {POSITION_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-brand text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No banners found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Image</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Link</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date Range</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="relative w-[60px] h-[40px] rounded overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          className="object-cover rounded"
                          sizes="60px"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px]">
                      <span className="block truncate">{banner.title}</span>
                    </td>

                    {/* Position */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {POSITION_LABELS[banner.position]}
                    </td>

                    {/* Order */}
                    <td className="px-4 py-3 text-gray-600">{banner.displayOrder}</td>

                    {/* Link */}
                    <td className="px-4 py-3 text-gray-600">
                      {banner.linkUrl ? (
                        <span
                          className="block max-w-[140px] truncate text-brand"
                          title={banner.linkUrl}
                        >
                          {banner.linkUrl}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Date range */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDateRange(banner)}
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          banner.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(banner)}
                          className="text-brand hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(banner.id)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBanner ? "Edit Banner" : "Add Banner"}
      >
        <div className="space-y-4 p-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Banner title"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://... or upload below"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? "Uploading…" : "Upload"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Preview */}
              {form.image && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="480px"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <Input
              value={form.linkUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={form.position}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, position: e.target.value as BannerPosition }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {(Object.entries(POSITION_LABELS) as [BannerPosition, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <Input
              type="number"
              value={String(form.displayOrder)}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))
              }
              placeholder="0"
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm((prev) => ({ ...prev, startsAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm((prev) => ({ ...prev, endsAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input
              id="banner-isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 accent-brand rounded cursor-pointer"
            />
            <label
              htmlFor="banner-isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Active
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-brand text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader />
                  <span>Saving…</span>
                </>
              ) : editingBanner ? (
                "Save Changes"
              ) : (
                "Create Banner"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Banner"
      >
        <div className="p-1 space-y-5">
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete this banner? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
