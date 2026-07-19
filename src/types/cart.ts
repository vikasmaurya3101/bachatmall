import { ProductCardData } from "./product";

export interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  product: ProductCardData;
}

export interface CartData {
  id: string;
  userId: string;
  items: CartItemData[];
}

export interface CartSummary {
  subtotal: number;
  totalMrp: number;
  totalDiscount: number;
  totalItems: number;
  itemCount: number;
}
