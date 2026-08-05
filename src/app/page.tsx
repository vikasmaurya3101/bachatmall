import { Suspense } from "react";
import { getHomeData } from "@/actions/get-home-data";
import LoginRequiredNotice from "@/components/shared/LoginRequiredNotice";
import Hero from "@/components/home/Hero";
import CategoryIconRow from "@/components/home/CategoryIconRow";
import TrustBadgeStrip from "@/components/home/TrustBadgeStrip";
import ChampionCategories from "@/components/home/ChampionCategories";
import CategoryGrid from "@/components/home/CategoryGrid";
import FlashSale from "@/components/home/FlashSale";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrendingProducts from "@/components/home/TrendingProducts";
import BestSellerProducts from "@/components/home/BestSellerProducts";
import NewArrivalProducts from "@/components/home/NewArrivalProducts";
import TopDeals from "@/components/home/TopDeals";
import BrandSection from "@/components/home/BrandSection";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import Newsletter from "@/components/home/Newsletter";

export const revalidate = 60;

export default async function HomePage() {
  const {
    categories,
    featuredProducts,
    flashSaleProducts,
    flashSaleEndsAt,
    newArrivals,
    trendingProducts,
    bestSellerProducts,
    brands,
  } = await getHomeData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <LoginRequiredNotice />
      </Suspense>
      <Hero />
      <CategoryIconRow categories={categories} />
      <TrustBadgeStrip />
      <ChampionCategories products={featuredProducts} />
      <CategoryGrid categories={categories} />
      <FlashSale products={flashSaleProducts} endsAt={flashSaleEndsAt} />
      <FeaturedProducts products={featuredProducts} />
      <TrendingProducts products={trendingProducts} />
      <TopDeals products={flashSaleProducts} />
      <BestSellerProducts products={bestSellerProducts} />
      <NewArrivalProducts products={newArrivals} />
      <BrandSection brands={brands} />
      <RecentlyViewed />
      <Newsletter />
    </div>
  );
}
