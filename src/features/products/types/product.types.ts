import {
  Brand,
  Category,
  Product,
  ProductImage,
  Seller,
} from "@prisma/client";

export type HomeProduct = Product & {
  brand: Brand | null;
  seller: Seller | null;
  images: ProductImage[];
};

export interface HomeData {
  categories: Category[];
  featuredProducts: HomeProduct[];
  flashSaleProducts: HomeProduct[];
  newArrivals: HomeProduct[];
  trendingProducts: HomeProduct[];
  brands: Brand[];
}