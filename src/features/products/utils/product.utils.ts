/**
 * Generate a URL-safe slug from a product name.
 * "Apple iPhone 15 128GB Blue" -> "apple-iphone-15-128gb-blue"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate a random SKU with an optional prefix, e.g. "BM-8F3K2A1Q".
 */
export function generateSku(prefix = "BM"): string {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${random}`;
}

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export function getStockStatus(
  stock: number,
  lowStockThreshold = 10
): StockStatus {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= lowStockThreshold) return "LOW_STOCK";
  return "IN_STOCK";
}

export function isLowStock(stock: number, threshold = 10): boolean {
  return stock > 0 && stock <= threshold;
}

/**
 * Build a canonical product URL path from its slug.
 */
export function getProductUrl(slug: string): string {
  return `/product/${slug}`;
}
