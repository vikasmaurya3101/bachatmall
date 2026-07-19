import { Product, ProductImage, Brand, Category, SubCategory, Seller, Review } from "@prisma/client";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type ProductSort =
  | "latest"
  | "oldest"
  | "price_low"
  | "price_high"
  | "rating"
  | "discount"
  | "popular";

export interface ProductFilters extends PaginationQuery {
  search?: string;

  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  sellerId?: string;

  minPrice?: number;
  maxPrice?: number;

  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;

  inStock?: boolean;

  sort?: ProductSort;
}

export interface ProductCard
  extends Omit<
    Product,
    "createdAt" | "updatedAt" | "description"
  > {
  images: ProductImage[];

  brand: Brand | null;

  category: Category;

  subCategory: SubCategory | null;

  seller: Seller | null;
}

export interface ProductDetails
  extends Product {
  images: ProductImage[];

  brand: Brand | null;

  category: Category;

  subCategory: SubCategory | null;

  seller: Seller | null;

  reviews: Review[];
}

export interface PaginationResponse<T> {
  data: T[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;
}