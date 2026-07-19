"use server";

import { productService } from "@/features/products/service/product.service";
import { serializeData } from "@/lib/serialize";

export async function getHomeData() {
  const data = await productService.getHomeData();
  return serializeData(data);
}
