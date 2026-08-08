import { Suspense } from "react";
import { getHomeData } from "@/actions/get-home-data";
import { prisma } from "@/lib/prisma";
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

const HERO_KEYS = [
  "hero_badge",
  "hero_title",
  "hero_subtitle",
  "hero_cta",
  "champion_section_title",
  "top_categories_title",
];

export default async function HomePage() {
  const [homeData, settingRows] = await Promise.all([
    getHomeData(),
    prisma.siteSetting.findMany({ where: { key: { in: HERO_KEYS } } }),
  ]);

  const s: Record<string, string> = {};
  for (const row of settingRows) s[row.key] = row.value;

  const {
    categories,
    featuredProducts,
    flashSaleProducts,
    flashSaleEndsAt,
    newArrivals,
    trendingProducts,
    bestSellerProducts,
    brands,
  } = homeData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <LoginRequiredNotice />
      </Suspense>
      <Hero
        badge={s["hero_badge"]}
        title={s["hero_title"]}
        subtitle={s["hero_subtitle"]}
        cta={s["hero_cta"]}
      />
      <CategoryIconRow categories={categories} />
      <TrustBadgeStrip />
      <ChampionCategories
        products={featuredProducts}
        sectionTitle={s["champion_section_title"]}
      />
      <CategoryGrid
        categories={categories}
        sectionTitle={s["top_categories_title"]}
      />
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
