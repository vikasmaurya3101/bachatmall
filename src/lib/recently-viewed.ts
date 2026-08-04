const STORAGE_KEY = "shopka_recently_viewed";
const MAX_ITEMS = 10;

export function trackProductView(productId: string) {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewedIds().filter(
      (id) => id !== productId
    );
    const updated = [productId, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private browsing, etc.) — ignore
  }
}

export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
