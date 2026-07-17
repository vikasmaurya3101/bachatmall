"use server";

import { productService } from "@/features/products/services/product.service";

export async function getHomeData() {
  return await productService.getHomePageData();
}