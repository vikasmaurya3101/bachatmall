import { notFound } from "next/navigation";
import productService from "@/features/products/service/product.service";
import { serializeData } from "@/lib/serialize";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPrice from "@/components/product/ProductPrice";
import ProductRating from "@/components/product/ProductRating";
import ProductGrid from "@/components/product/ProductGrid";
import ProductActions from "@/components/product/ProductActions";
import TrackProductView from "@/components/product/TrackProductView";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;

  try {
    const raw = await productService.getProductBySlug(slug);
    product = serializeData(raw);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6">
      <TrackProductView productId={product.id} />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />

          <div>
            {product.brand && (
              <p className="text-sm font-medium text-gray-400">
                {product.brand.name}
              </p>
            )}

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <ProductRating
                rating={product.avgRating}
                totalReviews={product.totalReviews}
              />
            </div>

            <div className="mt-4">
              <ProductPrice
                mrp={product.mrp}
                sellingPrice={product.sellingPrice}
                discountPercent={product.discountPercent}
                size="lg"
              />
            </div>

            {product.shortDescription && (
              <p className="mt-4 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            <p className="mt-4 text-sm">
              {product.stock === 0 ? (
                <span className="font-semibold text-red-600">Out of stock</span>
              ) : product.stock <= 10 ? (
                <span className="font-bold text-red-600">
                  ⚠ Only {product.stock} left in stock — order soon!
                </span>
              ) : (
                <span className="text-gray-500">{product.stock} in stock</span>
              )}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
              <span>🚚</span>
              <span>
                Estimated Delivery by{" "}
                <span className="font-medium text-gray-800">
                  {getEstimatedDelivery()}
                </span>
              </span>
            </div>

            {product.seller?.businessName && (
              <p className="mt-2 text-xs text-gray-400">
                Sold by: {product.seller.businessName}
              </p>
            )}

            <div className="mt-6">
              <ProductActions
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                inStock={product.stock > 0}
              />
            </div>

            {product.freeShipping && (
              <p className="mt-3 text-xs font-semibold text-success">
                Free Shipping on this item
              </p>
            )}

            <div className="mt-8 border-t pt-6">
              <h2 className="mb-2 font-semibold text-gray-800">
                Product Description
              </h2>
              <p className="whitespace-pre-line text-sm text-gray-600">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              You may also like
            </h2>
            <ProductGrid products={product.relatedProducts} />
          </section>
        )}
      </div>
    </main>
  );
}
