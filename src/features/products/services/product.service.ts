import { productRepository } from "../repositories/product.repository";

export class ProductService {
  async getHomePageData() {
    return productRepository.getHomeData();
  }
}

export const productService = new ProductService();