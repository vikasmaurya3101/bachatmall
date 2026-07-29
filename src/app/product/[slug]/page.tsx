import { notFound } from "next/navigation";
import productService from "@/features/products/service/product.service";
import { serializeData } from "@/lib/serialize";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPrice from "@/components/product/ProductPrice";
import ProductRating from "@/components/product/ProductRating";
import ProductGrid from "@/components/product/ProductGrid";
import ProductActions from "@/components/product/ProductActions";
import TrackProductView from "@/components/product/TrackProductView";
import ProductReviews from "@/components/product/ProductReviews";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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

  const reviewsPage = serializeData(
    await productService.getProductReviews(product.id, 1, 5)
  );
  const reviewSummary = serializeData(
    await productService.getReviewSummary(product.id)
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <TrackProductView productId={product.id} />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 rounded-xl bg-white p-5 sm:p-8 lg:grid-cols-2">
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

            <div className="mt-6">
              <ProductActions
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                inStock={product.stock > 0}
              />
            </div>

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

        <ProductReviews
          productId={product.id}
          initialReviews={reviewsPage.data}
          initialSummary={reviewSummary}
          initialTotalPages={reviewsPage.totalPages}
        />

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
