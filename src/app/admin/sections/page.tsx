"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Image from "next/image";

type SectionKey = "featured" | "trending" | "bestseller" | "newarrival";
type FlagKey = "isFeatured" | "isTrending" | "isBestSeller" | "isNewArrival";

interface ProductImage {
  url: string;
  isThumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  images: ProductImage[];
}

interface SectionConfig {
  key: SectionKey;
  label: string;
  flag: FlagKey;
  badgeColor: string;
}

const SECTIONS: SectionConfig[] = [
  { key: "featured",   label: "Featured Products", flag: "isFeatured",   badgeColor: "bg-purple-100 text-purple-700" },
  { key: "trending",   label: "Trending Now",      flag: "isTrending",   badgeColor: "bg-orange-100 text-orange-700" },
  { key: "bestseller", label: "Best Sellers",      flag: "isBestSeller", badgeColor: "bg-green-100 text-green-700"  },
  { key: "newarrival", label: "New Arrivals",       flag: "isNewArrival", badgeColor: "bg-blue-100 text-blue-700"   },
];

const emptyRecord = <T,>(val: T): Record<SectionKey, T> => ({
  featured: val,
  trending: val,
  bestseller: val,
  newarrival: val,
});

export default function SectionsPage() {
  const { user, isAuthenticated, isLoading: loading } = useSession();

  const [activeSection, setActiveSection] = useState<SectionKey>("featured");
  const [sectionProducts, setSectionProducts] = useState<Record<SectionKey, Product[]>>(
    emptyRecord<Product[]>([])
  );
  const [sectionCounts, setSectionCounts] = useState<Record<SectionKey, number>>(
    emptyRecord(0)
  );
  const [sectionLoading, setSectionLoading] = useState<Record<SectionKey, boolean>>(
    emptyRecord(true)
  );
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [updatingIds, setUpdatingIds]     = useState<Set<string>>(new Set());

  // ---- data fetching -------------------------------------------------------

  const fetchSectionProducts = useCallback(async (section: SectionKey) => {
    setSectionLoading((prev) => ({ ...prev, [section]: true }));
    try {
      const res  = await fetch(`/api/admin/products/sections?section=${section}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setSectionProducts((prev) => ({ ...prev, [section]: data.data.products }));
        setSectionCounts((prev)   => ({ ...prev, [section]: data.data.total }));
      } else {
        toast.error(data.message || "Failed to load section.");
      }
    } catch {
      toast.error("Failed to load section products.");
    } finally {
      setSectionLoading((prev) => ({ ...prev, [section]: false }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      SECTIONS.forEach((s) => fetchSectionProducts(s.key));
    }
  }, [isAuthenticated, user, fetchSectionProducts]);

  // ---- search (debounced) --------------------------------------------------

  const searchProducts = useCallback(
    async (query: string) => {
      if (!query.trim()) { setSearchResults([]); return; }
      setSearchLoading(true);
      try {
        const res  = await fetch(
          `/api/admin/products/sections?search=${encodeURIComponent(query)}&limit=30`
        );
        const data = await res.json();
        if (data.success) {
          const currentIds = new Set(sectionProducts[activeSection].map((p) => p.id));
          setSearchResults(data.data.products.filter((p: Product) => !currentIds.has(p.id)));
        }
      } catch {
        toast.error("Search failed.");
      } finally {
        setSearchLoading(false);
      }
    },
    [activeSection, sectionProducts]
  );

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // ---- handlers ------------------------------------------------------------

  const handleTabChange = (section: SectionKey) => {
    setActiveSection(section);
    setSearchQuery("");
    setSearchResults([]);
  };

  const updateFlag = async (productId: string, flag: FlagKey, value: boolean) => {
    setUpdatingIds((prev) => new Set(prev).add(productId));

    // Optimistic update
    if (value) {
      const product = searchResults.find((p) => p.id === productId);
      if (product) {
        setSectionProducts((prev) => ({
          ...prev,
          [activeSection]: [...prev[activeSection], { ...product, [flag]: true }],
        }));
        setSectionCounts((prev) => ({ ...prev, [activeSection]: prev[activeSection] + 1 }));
        setSearchResults((prev) => prev.filter((p) => p.id !== productId));
      }
    } else {
      setSectionProducts((prev) => ({
        ...prev,
        [activeSection]: prev[activeSection].filter((p) => p.id !== productId),
      }));
      setSectionCounts((prev) => ({
        ...prev,
        [activeSection]: Math.max(0, prev[activeSection] - 1),
      }));
    }

    try {
      const res  = await fetch("/api/admin/products/sections", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ productId, flags: { [flag]: value } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success(value ? "Added to section." : "Removed from section.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
      // Revert optimistic change
      fetchSectionProducts(activeSection);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // ---- render --------------------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">You don&apos;t have access to this page.</p>
      </main>
    );
  }

  const activeConfig = SECTIONS.find((s) => s.key === activeSection)!;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Homepage Sections
        </h1>

        {/* Section tabs */}
        <div className="mb-6 flex gap-1 border-b">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleTabChange(s.key)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                activeSection === s.key
                  ? "border-b-2 border-brand text-brand"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {s.label}
              <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                {sectionCounts[s.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Current section products */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              In this section
            </h2>
            {sectionLoading[activeSection] ? (
              <Loader size="lg" />
            ) : sectionProducts[activeSection].length === 0 ? (
              <p className="text-gray-400">No products in this section yet.</p>
            ) : (
              <div className="overflow-hidden rounded-xl border bg-white">
                {sectionProducts[activeSection].map((p) => {
                  const thumb = p.images.find((i) => i.isThumbnail)?.url ?? p.images[0]?.url;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 border-b p-3 last:border-0"
                    >
                      {thumb && (
                        <Image
                          src={thumb}
                          alt={p.name}
                          width={36}
                          height={36}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-800">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400">₹{p.sellingPrice}</div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${activeConfig.badgeColor}`}>
                        {activeConfig.label}
                      </span>
                      <button
                        onClick={() => updateFlag(p.id, activeConfig.flag, false)}
                        disabled={updatingIds.has(p.id)}
                        className="rounded-lg border px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {updatingIds.has(p.id) ? "…" : "Remove"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search to add */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Add products
            </h2>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to add…"
            />
            <div className="mt-3">
              {searchLoading ? (
                <Loader size="lg" />
              ) : searchResults.length === 0 && searchQuery.trim() ? (
                <p className="text-sm text-gray-400">No results.</p>
              ) : (
                <div className="overflow-hidden rounded-xl border bg-white">
                  {searchResults.map((p) => {
                    const thumb = p.images.find((i) => i.isThumbnail)?.url ?? p.images[0]?.url;
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 border-b p-3 last:border-0"
                      >
                        {thumb && (
                          <Image
                            src={thumb}
                            alt={p.name}
                            width={36}
                            height={36}
                            className="rounded-md object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-gray-800">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-400">₹{p.sellingPrice}</div>
                        </div>
                        <Button
                          onClick={() => updateFlag(p.id, activeConfig.flag, true)}
                          disabled={updatingIds.has(p.id)}
                        >
                          {updatingIds.has(p.id) ? "Adding…" : "+ Add"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}