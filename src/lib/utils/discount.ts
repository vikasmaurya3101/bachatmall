export function calculateDiscountPercentage(
  mrp: number,
  sellingPrice: number
): number {
  if (mrp <= 0) return 0;

  return Math.round(
    ((mrp - sellingPrice) / mrp) * 100
  );
}

export function calculateSaving(
  mrp: number,
  sellingPrice: number
): number {
  return Math.max(0, mrp - sellingPrice);
}

export function hasDiscount(
  mrp: number,
  sellingPrice: number
): boolean {
  return sellingPrice < mrp;
}

/**
 * Flat extra discount applied when paying online (prepaid) at checkout,
 * on top of whatever product-level discount already applies. Mirrors the
 * "Pay Online — Save ₹X" pattern used by Meesho's checkout.
 */
export const PREPAID_DISCOUNT = 15;

export function getPrepaidAmount(subtotal: number): number {
  return Math.max(0, subtotal - PREPAID_DISCOUNT);
}