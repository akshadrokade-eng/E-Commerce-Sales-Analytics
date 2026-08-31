// Data access layer for dashboard JSON files
// These functions read from web/data/ directory

import fs from 'fs';
import path from 'path';
import {
  SummaryData,
  CategoryData,
  RegionData,
  PaymentData,
  YearlyData,
  MonthlyData,
  CustomerData,
  OperationsData,
  RelationshipsData,
} from '@/types';

// Path to the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Helper function to read JSON files
function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

// Get summary data
export function getSummary(): SummaryData {
  return readJsonFile<SummaryData>('summary.json');
}

// Get category data
export function getCategoryData(): CategoryData[] {
  return readJsonFile<CategoryData[]>('category.json');
}

// Get region data
export function getRegionData(): RegionData[] {
  return readJsonFile<RegionData[]>('region.json');
}

// Get payment data
export function getPaymentData(): PaymentData[] {
  return readJsonFile<PaymentData[]>('payment.json');
}

// Get yearly data
export function getYearlyData(): YearlyData[] {
  return readJsonFile<YearlyData[]>('yearly.json');
}

// Get monthly data
export function getMonthlyData(): MonthlyData[] {
  return readJsonFile<MonthlyData[]>('monthly.json');
}

// Get customer data
export function getCustomerData(): CustomerData[] {
  return readJsonFile<CustomerData[]>('customers.json');
}

// Get operations data
export function getOperationsData(): OperationsData {
  return readJsonFile<OperationsData>('operations.json');
}

// Get relationships data
export function getRelationshipsData(): RelationshipsData {
  return readJsonFile<RelationshipsData>('relationships.json');
}
