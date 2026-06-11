export class DailySalesDto {
  date: string;
  total: number;
  count: number;
}

export class TopProductDto {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export class StatsResponseDto {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  dailySales: DailySalesDto[];
  topProducts: TopProductDto[];
}
