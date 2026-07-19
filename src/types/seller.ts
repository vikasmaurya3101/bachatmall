export interface SellerData {
  id: string;
  userId: string;
  businessName: string;
  gstNumber: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface SellerDashboardStats {
  totalProducts: number;
  publishedProducts: number;
  outOfStock: number;
  lowStock: number;
  totalOrders?: number;
  totalRevenue?: number;
}
