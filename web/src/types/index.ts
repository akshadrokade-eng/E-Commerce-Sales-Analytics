// TypeScript types for dashboard data
// Based on actual JSON schemas from web/data/

export interface SummaryData {
  total_revenue: number;
  total_orders: number;
  unique_customers: number;
  average_order_revenue: number;
  total_quantity: number;
  average_quantity: number;
  average_delivery_days: number;
  average_customer_rating: number;
  average_discount: number;
  date_range_start: string;
  date_range_end: string;
}

export interface CategoryData {
  product_category: string;
  revenue: number;
  orders: number;
  quantity: number;
  average_order_revenue: number;
  average_rating: number;
  average_discount: number;
  average_delivery_days: number;
}

export interface RegionData {
  region: string;
  revenue: number;
  orders: number;
  quantity: number;
  average_order_revenue: number;
  average_rating: number;
  average_delivery_days: number;
}

export interface PaymentData {
  payment_method: string;
  orders: number;
  revenue: number;
  percentage_of_orders: number;
  percentage_of_revenue: number;
  average_order_revenue: number;
}

export interface YearlyData {
  year: number;
  revenue: number;
  orders: number;
  quantity: number;
  average_order_revenue: number;
}

export interface MonthlyData {
  month: number;
  revenue: number;
  orders: number;
  quantity: number;
  average_order_revenue: number;
  month_name: string;
}

export interface CustomerData {
  customer_id: number;
  total_orders: number;
  total_revenue: number;
  total_quantity: number;
  average_order_revenue: number;
  average_rating: number;
  average_delivery_days: number;
}

export interface OperationsData {
  delivery_distribution: DeliveryDistribution[];
  delivery_by_region: DeliveryByRegion[];
  delivery_by_category: DeliveryByCategory[];
  rating_distribution: RatingDistribution[];
  rating_by_category: RatingByCategory[];
  rating_by_region: RatingByRegion[];
}

export interface DeliveryDistribution {
  days: number;
  count: number;
}

export interface DeliveryByRegion {
  region: string;
  average_delivery_days: number;
}

export interface DeliveryByCategory {
  category: string;
  average_delivery_days: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface RatingByCategory {
  category: string;
  average_rating: number;
}

export interface RatingByRegion {
  region: string;
  average_rating: number;
}

export interface RelationshipsData {
  quantity_vs_revenue: QuantityVsRevenue[];
  discount_vs_revenue: DiscountVsRevenue[];
  delivery_days_vs_rating: DeliveryDaysVsRating[];
  correlations: Correlations;
}

export interface QuantityVsRevenue {
  quantity: number;
  revenue: number;
}

export interface DiscountVsRevenue {
  discount: number;
  revenue: number;
}

export interface DeliveryDaysVsRating {
  delivery_days: number;
  customer_rating: number;
}

export interface Correlations {
  quantity_revenue_correlation: number;
  discount_revenue_correlation: number;
  delivery_rating_correlation: number;
}
