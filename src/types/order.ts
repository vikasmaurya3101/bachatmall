export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "RAZORPAY" | "COD" | "UPI";

export type ShipmentStatus =
  | "PENDING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "FAILED";

export type AddressType = "HOME" | "WORK" | "OTHER";

export interface AddressData {
  id: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  apartment: string | null;
  area: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  completeAddress: string;
  type: AddressType;
  isDefault: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  sku: string;
  quantity: number;
  mrp: number | string;
  sellingPrice: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  product?: { estimatedDeliveryDays: number } | null;
}

export interface PaymentData {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number | string;
  paidAt: string | null;
}

export interface OrderData {
  id: string;
  invoiceNumber: string;
  items: OrderItemData[];
  address: AddressData;
  subtotal: number | string;
  discountAmount: number | string;
  shippingCharge: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shipmentStatus: ShipmentStatus;
  payment: PaymentData | null;
  placedAt: string;
  deliveredAt: string | null;
  cancelReason: string | null;
  returnReason: string | null;
  returnRequestedAt: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}
