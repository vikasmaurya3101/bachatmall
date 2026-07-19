export const DEFAULT_CURRENCY = "INR";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | string): string {
  const amount =
    typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(amount)) return formatter.format(0);

  return formatter.format(amount);
}

export function formatCompactCurrency(
  value: number | string
): string {
  const amount =
    typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  return Number(
    value.replace(/[₹,\s]/g, "")
  );
}