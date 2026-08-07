"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "@/providers/SessionProvider";
import Loader from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Tab = "categories" | "subcategories" | "brands" | "assignments";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  _count: { products: number; subCategories: number };
}

interface SubCategoryRow {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  displayOrder: number;
  categoryId: string;
  category: { id: string; name: string };
  _count: { products: number };
}

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  isActive: boolean;
  _count: { products: number };
}

const TABS: { key: Tab; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Subcategories" },
  { key: "brands", label: "Brands" },
  { key: "assignments", label: "Product Assignments" },
];

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/upload-image", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();

  return json.url ?? null;
}

export default function AdminCatalogPage() {
  const { user, isAuthenticated, isLoading: isSessionLoading } = useSession();
  const isAuthorized = isAuthenticated && user?.role === "ADMIN";

  const [tab, setTab] = useState<Tab>("categories");
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryRow[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catRes, subRes, brandRes] = await Promise.all([
        fetch("/api/admin/catalog/categories"),
        fetch("/api/admin/catalog/subcategories"),
        fetch("/api/admin/catalog/brands"),
      ]);
      const [catJson, subJson, brandJson] = await Promise.all([
        catRes.json(),
        subRes.json(),
        brandRes.json(),
      ]);

      if (catJson.success) setCategories(catJson.data);
      if (subJson.success) setSubCategories(subJson.data);
      if (brandJson.success) setBrands(brandJson.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) loadAll();
  }, [isAuthorized, loadAll]);

  if (isSessionLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <Loader size="lg" />
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-lg text-gray-600">
          You don&apos;t have access to this page.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
          Catalog
        </h1>

        <div className="mb-6 flex gap-1 border-b">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                tab === t.key
                  ? "border-b-2 border-brand text-brand"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loader size="lg" />
        ) : tab === "categories" ? (
          <CategoriesTab
            categories={categories}
            onChanged={loadAll}
          />
        ) : tab === "subcategories" ? (
          <SubCategoriesTab
            subCategories={subCategories}
            categories={categories}
            onChanged={loadAll}
          />
        ) : tab === "brands" ? (
          <BrandsTab brands={brands} onChanged={loadAll} />
        ) : (
          <ProductAssignmentsTab
            categories={categories}
            subCategories={subCategories}
          />
        )}
      </div>
    </main>
  );
}

/* ---------------------------------- Categories ---------------------------------- */

function CategoriesTab({
  categories,
  onChanged,
}: {
  categories: CategoryRow[];
  onChanged: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setImage("");
    setIsActive(true);
    setDisplayOrder("0");
    setModalOpen(true);
  }

  function openEdit(row: CategoryRow) {
    setEditing(row);
    setName(row.name);
    setDescription(row.description ?? "");
    setImage(row.image ?? "");
    setIsActive(row.isActive);
    setDisplayOrder(String(row.displayOrder));
    setModalOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (!url) return toast.error("Upload failed. Try again.");
      setImage(url);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) return toast.error("Name is required.");

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        image,
        isActive,
        displayOrder: Number(displayOrder) || 0,
      };

      const res = await fetch(
        editing
          ? `/api/admin/catalog/categories/${editing.id}`
          : "/api/admin/catalog/categories",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();

      if (!json.success) return toast.error(json.message ?? "Something went wrong.");

      toast.success(editing ? "Category updated." : "Category created.");
      setModalOpen(false);
      onChanged();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(row: CategoryRow) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/admin/catalog/categories/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) return toast.error(json.message ?? "Unable to delete.");
      toast.success("Category deleted.");
      onChanged();
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleActive(row: CategoryRow) {
    const res = await fetch(`/api/admin/catalog/categories/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !row.isActive }),
    });
    const json = await res.json();
    if (!json.success) return toast.error(json.message ?? "Unable to update.");
    onChanged();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>+ Add Category</Button>
      </div>

      <CatalogTable
        rows={categories}
        columns={[
          {
            header: "Category",
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.image && (
                  <Image
                    src={row.image}
                    alt={row.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">{row.name}</div>
                  <div className="text-xs text-gray-400">{row.slug}</div>
                </div>
              </div>
            ),
          },
          {
            header: "Subcategories",
            render: (row) => row._count.subCategories,
          },
          { header: "Products", render: (row) => row._count.products },
          { header: "Order", render: (row) => row.displayOrder },
          {
            header: "Status",
            render: (row) => (
              <button
                onClick={() => toggleActive(row)}
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  row.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {row.isActive ? "Active" : "Hidden"}
              </button>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Edit Category" : "Add Category"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {isUploading && <p className="text-xs text-gray-400">Uploading...</p>}
            {image && (
              <Image
                src={image}
                alt="preview"
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            )}
          </div>

          <Input
            label="Display order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active (visible on storefront)
          </label>

          <Button fullWidth loading={isSaving} onClick={handleSave}>
            {editing ? "Save changes" : "Create category"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* -------------------------------- SubCategories ---------------------------------- */

function SubCategoriesTab({
  subCategories,
  categories,
  onChanged,
}: {
  subCategories: SubCategoryRow[];
  categories: CategoryRow[];
  onChanged: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategoryRow | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setCategoryId(categories[0]?.id ?? "");
    setImage("");
    setIsActive(true);
    setDisplayOrder("0");
    setModalOpen(true);
  }

  function openEdit(row: SubCategoryRow) {
    setEditing(row);
    setName(row.name);
    setCategoryId(row.categoryId);
    setImage(row.image ?? "");
    setIsActive(row.isActive);
    setDisplayOrder(String(row.displayOrder));
    setModalOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (!url) return toast.error("Upload failed. Try again.");
      setImage(url);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) return toast.error("Name is required.");
    if (!categoryId) return toast.error("Pick a parent category.");

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        categoryId,
        image,
        isActive,
        displayOrder: Number(displayOrder) || 0,
      };

      const res = await fetch(
        editing
          ? `/api/admin/catalog/subcategories/${editing.id}`
          : "/api/admin/catalog/subcategories",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();

      if (!json.success) return toast.error(json.message ?? "Something went wrong.");

      toast.success(editing ? "Subcategory updated." : "Subcategory created.");
      setModalOpen(false);
      onChanged();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(row: SubCategoryRow) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/admin/catalog/subcategories/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) return toast.error(json.message ?? "Unable to delete.");
      toast.success("Subcategory deleted.");
      onChanged();
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleActive(row: SubCategoryRow) {
    const res = await fetch(`/api/admin/catalog/subcategories/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !row.isActive }),
    });
    const json = await res.json();
    if (!json.success) return toast.error(json.message ?? "Unable to update.");
    onChanged();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} disabled={categories.length === 0}>
          + Add Subcategory
        </Button>
      </div>

      {categories.length === 0 && (
        <p className="mb-4 text-sm text-gray-500">
          Add a category first — subcategories need a parent.
        </p>
      )}

      <CatalogTable
        rows={subCategories}
        columns={[
          {
            header: "Subcategory",
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.image && (
                  <Image
                    src={row.image}
                    alt={row.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">{row.name}</div>
                  <div className="text-xs text-gray-400">{row.slug}</div>
                </div>
              </div>
            ),
          },
          { header: "Category", render: (row) => row.category.name },
          { header: "Products", render: (row) => row._count.products },
          { header: "Order", render: (row) => row.displayOrder },
          {
            header: "Status",
            render: (row) => (
              <button
                onClick={() => toggleActive(row)}
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  row.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {row.isActive ? "Active" : "Hidden"}
              </button>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Edit Subcategory" : "Add Subcategory"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mobile Accessories"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Parent category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {isUploading && <p className="text-xs text-gray-400">Uploading...</p>}
            {image && (
              <Image
                src={image}
                alt="preview"
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            )}
          </div>

          <Input
            label="Display order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active (visible on storefront)
          </label>

          <Button fullWidth loading={isSaving} onClick={handleSave}>
            {editing ? "Save changes" : "Create subcategory"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------------- Brands --------------------------------------- */

function BrandsTab({
  brands,
  onChanged,
}: {
  brands: BrandRow[];
  onChanged: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setDescription("");
    setLogo("");
    setIsActive(true);
    setModalOpen(true);
  }

  function openEdit(row: BrandRow) {
    setEditing(row);
    setName(row.name);
    setDescription(row.description ?? "");
    setLogo(row.logo ?? "");
    setIsActive(row.isActive);
    setModalOpen(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (!url) return toast.error("Upload failed. Try again.");
      setLogo(url);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) return toast.error("Name is required.");

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        logo,
        isActive,
      };

      const res = await fetch(
        editing ? `/api/admin/catalog/brands/${editing.id}` : "/api/admin/catalog/brands",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();

      if (!json.success) return toast.error(json.message ?? "Something went wrong.");

      toast.success(editing ? "Brand updated." : "Brand created.");
      setModalOpen(false);
      onChanged();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(row: BrandRow) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/admin/catalog/brands/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) return toast.error(json.message ?? "Unable to delete.");
      toast.success("Brand deleted.");
      onChanged();
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleActive(row: BrandRow) {
    const res = await fetch(`/api/admin/catalog/brands/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !row.isActive }),
    });
    const json = await res.json();
    if (!json.success) return toast.error(json.message ?? "Unable to update.");
    onChanged();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>+ Add Brand</Button>
      </div>

      <CatalogTable
        rows={brands}
        columns={[
          {
            header: "Brand",
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.logo && (
                  <Image
                    src={row.logo}
                    alt={row.name}
                    width={36}
                    height={36}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">{row.name}</div>
                  <div className="text-xs text-gray-400">{row.slug}</div>
                </div>
              </div>
            ),
          },
          { header: "Products", render: (row) => row._count.products },
          {
            header: "Status",
            render: (row) => (
              <button
                onClick={() => toggleActive(row)}
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  row.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {row.isActive ? "Active" : "Hidden"}
              </button>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Edit Brand" : "Add Brand"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samsung"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {isUploading && <p className="text-xs text-gray-400">Uploading...</p>}
            {logo && (
              <Image
                src={logo}
                alt="preview"
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active (visible on storefront)
          </label>

          <Button fullWidth loading={isSaving} onClick={handleSave}>
            {editing ? "Save changes" : "Create brand"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------- Product Assignments -------------------------------- */

interface AssignmentProduct {
  id: string;
  name: string;
  sku: string;
  isPublished: boolean;
  images: { url: string; isThumbnail?: boolean }[];
  category: { id: string; name: string };
  subCategory: { id: string; name: string } | null;
}

interface AssignmentListResponse {
  data: AssignmentProduct[];
  total: number;
  page: number;
  totalPages: number;
}

function ProductAssignmentsTab({
  categories,
  subCategories,
}: {
  categories: CategoryRow[];
  subCategories: SubCategoryRow[];
}) {
  const [products, setProducts] = useState<AssignmentProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  // per-row pending changes: productId → { categoryId, subCategoryId }
  const [pending, setPending] = useState<
    Record<string, { categoryId: string; subCategoryId: string | null }>
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      if (filterCategoryId) params.set("categoryId", filterCategoryId);
      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();
      if (json.success) {
        const d: AssignmentListResponse = json.data;
        setProducts(d.data);
        setTotalPages(d.totalPages);
        setTotal(d.total);
        // seed pending with current values so dropdowns start correct
        setPending((prev) => {
          const next = { ...prev };
          d.data.forEach((p) => {
            if (!next[p.id]) {
              next[p.id] = {
                categoryId: p.category.id,
                subCategoryId: p.subCategory?.id ?? null,
              };
            }
          });
          return next;
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterCategoryId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function getPending(p: AssignmentProduct) {
    return (
      pending[p.id] ?? {
        categoryId: p.category.id,
        subCategoryId: p.subCategory?.id ?? null,
      }
    );
  }

  function isDirty(p: AssignmentProduct) {
    const cur = getPending(p);
    return (
      cur.categoryId !== p.category.id ||
      cur.subCategoryId !== (p.subCategory?.id ?? null)
    );
  }

  function setCategoryForProduct(productId: string, categoryId: string) {
    setPending((prev) => ({
      ...prev,
      [productId]: { categoryId, subCategoryId: null }, // reset sub when category changes
    }));
  }

  function setSubCategoryForProduct(
    productId: string,
    subCategoryId: string | null
  ) {
    setPending((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], subCategoryId },
    }));
  }

  async function handleSave(p: AssignmentProduct) {
    const cur = getPending(p);
    setSavingId(p.id);
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: cur.categoryId,
          subCategoryId: cur.subCategoryId ?? null,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message ?? "Failed to update.");
        return;
      }
      toast.success(`"${p.name}" reassigned.`);
      // reflect the save in the product list so isDirty resets
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== p.id) return prod;
          const newCat = categories.find((c) => c.id === cur.categoryId);
          const newSub = subCategories.find(
            (s) => s.id === cur.subCategoryId
          );
          return {
            ...prod,
            category: newCat
              ? { id: newCat.id, name: newCat.name }
              : prod.category,
            subCategory: newSub
              ? { id: newSub.id, name: newSub.name }
              : null,
          };
        })
      );
    } finally {
      setSavingId(null);
    }
  }

  const thumb = (p: AssignmentProduct) =>
    p.images.find((i) => i.isThumbnail)?.url ?? p.images[0]?.url;

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand w-56"
        />
        <select
          value={filterCategoryId}
          onChange={(e) => {
            setFilterCategoryId(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-gray-500">{total} products</span>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subcategory</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cur = getPending(p);
                const dirty = isDirty(p);
                const availableSubs = subCategories.filter(
                  (s) => s.categoryId === cur.categoryId
                );
                const t = thumb(p);
                return (
                  <tr
                    key={p.id}
                    className={`border-t transition-colors ${dirty ? "bg-amber-50" : ""}`}
                  >
                    {/* Product name + thumbnail */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {t && (
                          <Image
                            src={t}
                            alt={p.name}
                            width={36}
                            height={36}
                            className="rounded-md object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-800 leading-tight">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-400">{p.sku}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category dropdown */}
                    <td className="p-3">
                      <select
                        value={cur.categoryId}
                        onChange={(e) =>
                          setCategoryForProduct(p.id, e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Subcategory dropdown */}
                    <td className="p-3">
                      <select
                        value={cur.subCategoryId ?? ""}
                        onChange={(e) =>
                          setSubCategoryForProduct(
                            p.id,
                            e.target.value || null
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand bg-white"
                        disabled={availableSubs.length === 0}
                      >
                        <option value="">— None —</option>
                        {availableSubs.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status badge */}
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          p.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Save button — only active when something changed */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSave(p)}
                        disabled={!dirty || savingId === p.id}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          dirty
                            ? "bg-brand text-white hover:opacity-90"
                            : "bg-gray-100 text-gray-400 cursor-default"
                        } disabled:opacity-60`}
                      >
                        {savingId === p.id ? "Saving…" : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((v) => Math.max(1, v - 1))}
            disabled={page <= 1}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------- Shared table --------------------------------- */

function CatalogTable<T extends { id: string }>({
  rows,
  columns,
  onEdit,
  onDelete,
  deletingId,
}: {
  rows: T[];
  columns: { header: string; render: (row: T) => React.ReactNode }[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  deletingId: string | null;
}) {
  if (rows.length === 0) {
    return <p className="text-gray-500">Nothing here yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="p-3">
                {col.header}
              </th>
            ))}
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((col) => (
                <td key={col.header} className="p-3 align-middle">
                  {col.render(row)}
                </td>
              ))}
              <td className="p-3 text-right">
                <button
                  onClick={() => onEdit(row)}
                  className="mr-3 font-medium text-brand hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row)}
                  disabled={deletingId === row.id}
                  className="font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === row.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
