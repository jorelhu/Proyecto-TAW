import axios from 'axios';

export interface DailySales {
  date: string;
  total: number;
  count: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface StatsResponse {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  dailySales: DailySales[];
  topProducts: TopProduct[];
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const statsService = {
  getStats: async (startDate?: string, endDate?: string): Promise<StatsResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/orders/stats?${params.toString()}`);
    return response.data;
  },
};