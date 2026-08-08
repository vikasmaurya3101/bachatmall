import { Suspense } from "react";
import { getHomeData } from "@/actions/get-home-data";
import { prisma } from "@/lib/prisma";
import LoginRequiredNotice from "@/components/shared/LoginRequiredNotice";
import Hero from "@/components/home/Hero";
import CategoryIconRow from "@/components/home/CategoryIconRow";
import ChampionCategories from "@/components/home/ChampionCategories";
import FlashSale from "@/components/home/FlashSale";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrendingProducts from "@/components/home/TrendingProducts";
import BestSellerProducts from "@/components/home/BestSellerProducts";
import NewArrivalProducts from "@/components/home/NewArrivalProducts";
import TopDeals from "@/components/home/TopDeals";
import BrandSection from "@/components/home/BrandSection";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import Newsletter from "@/components/home/Newsletter";
import { unstable_cache } from "next/cache";

export const revalidate = 60;

const HERO_KEYS = [
  "logo_url",
  "hero_badge",
  "hero_title",
  "hero_subtitle",
  "hero_cta",
  "hero_stat1_val", "hero_stat1_lbl",
  "hero_stat2_val", "hero_stat2_lbl",
  "hero_stat3_val", "hero_stat3_lbl",
  "hero_card1_label", "hero_card1_value",
  "hero_card2_label", "hero_card2_value",
  "hero_card3_label", "hero_card3_value",
  "champion_section_title",
];

const getHeroSettings = unstable_cache(
  async () => {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: HERO_KEYS } } });
    const s: Record<string, string> = {};
    for (const row of rows) s[row.key] = row.value;
    return s;
  },
  ["hero-settings"],
  { revalidate: 60 }
);

export default async function HomePage() {
  const [homeData, s] = await Promise.all([
    getHomeData(),
    getHeroSettings(),
  ]);

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
        logoUrl={s["logo_url"]}
        stat1Val={s["hero_stat1_val"]}
        stat1Lbl={s["hero_stat1_lbl"]}
        stat2Val={s["hero_stat2_val"]}
        stat2Lbl={s["hero_stat2_lbl"]}
        stat3Val={s["hero_stat3_val"]}
        stat3Lbl={s["hero_stat3_lbl"]}
        card1Label={s["hero_card1_label"]}
        card1Value={s["hero_card1_value"]}
        card2Label={s["hero_card2_label"]}
        card2Value={s["hero_card2_value"]}
        card3Label={s["hero_card3_label"]}
        card3Value={s["hero_card3_value"]}
      />
      <CategoryIconRow categories={categories} />
      <ChampionCategories
        products={featuredProducts}
        sectionTitle={s["champion_section_title"]}
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
