"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/providers/SessionProvider";
import { Loader, Input, Button } from "@/components/ui/";
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
  const { session, loading } = useSession();

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
    if (session?.role === "ADMIN") {
      SECTIONS.forEach((s) => fetchSectionProducts(s.key));
    }
  }, [session, fetchSectionProducts]);

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
