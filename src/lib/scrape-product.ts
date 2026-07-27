/**
 * Best-effort product-details scraper.
 *
 * Big e-commerce sites (Amazon, Flipkart etc.) actively block server-side
 * scraping with bot-detection/CAPTCHAs, so this will NOT work 100% of the
 * time. It tries, in order:
 *   1. JSON-LD "Product" schema (most reliable when present)
 *   2. Open Graph / standard meta tags (og:title, og:image, og:description)
 *   3. A regex guess at a rupee price on the page
 *
 * Whatever it can't find comes back as null/empty so the admin can just
 * type it in manually — this is a convenience autofill, not a guarantee.
 */

export interface ScrapedProduct {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  sourceUrl: string;
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtmlEntities(match[1]);
  }

  return null;
}

function extractNameMeta(html: string): string | null {
  const patterns = [
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
    /<title>([^<]+)<\/title>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtmlEntities(match[1].trim());
  }

  return null;
}

function extractJsonLdProduct(html: string): Partial<ScrapedProduct> | null {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of candidates) {
        const node =
          item["@type"] === "Product"
            ? item
            : item["@graph"]?.find(
                (g: { "@type"?: string }) => g["@type"] === "Product"
              );

        if (!node) continue;

        const offer = Array.isArray(node.offers)
          ? node.offers[0]
          : node.offers;

        const image = Array.isArray(node.image) ? node.image[0] : node.image;

        return {
          name: typeof node.name === "string" ? node.name : null,
          description:
            typeof node.description === "string" ? node.description : null,
          imageUrl: typeof image === "string" ? image : null,
          price: offer?.price ? Number(offer.price) : null,
        };
      }
    } catch {
      // not valid JSON-LD, skip
    }
  }

  return null;
}

function guessPrice(html: string): number | null {
  const match = html.match(/[₹Rs.]\s?([\d,]+(?:\.\d{1,2})?)/);
  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function scrapeProductFromUrl(
  url: string
): Promise<ScrapedProduct> {
  const result: ScrapedProduct = {
    name: null,
    description: null,
    imageUrl: null,
    price: null,
    sourceUrl: url,
  };

  let html: string;

  try {
    const res = await fetch(url, {
      headers: {
        // A realistic browser UA — without this, most sites just return
        // an empty/blocked page.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      // Don't hang forever on slow/blocking sites.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return result;

    html = await res.text();
  } catch {
    return result;
  }

  const jsonLd = extractJsonLdProduct(html);

  result.name = jsonLd?.name ?? extractMeta(html, "og:title") ?? extractNameMeta(html);
  result.description =
    jsonLd?.description ?? extractMeta(html, "og:description");
  result.imageUrl = jsonLd?.imageUrl ?? extractMeta(html, "og:image");
  result.price = jsonLd?.price ?? guessPrice(html);

  return result;
}
