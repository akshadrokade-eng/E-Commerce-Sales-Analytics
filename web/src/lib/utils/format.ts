// Formatting utilities for the dashboard

/**
 * Format currency as INR (compact for dashboard display)
 * Examples: ₹51.10L, ₹1.83Cr, ₹5,109
 */
export function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `₹${value.toLocaleString('en-IN')}`;
  }
  return `₹${value.toFixed(2)}`;
}

/**
 * Format currency as INR (detailed for tooltips)
 * Example: ₹5,109,775.74
 */
export function formatINRDetailed(value: number): string {
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format number with commas (Indian format)
 * Example: 5,000
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

/**
 * Format percentage
 * Example: 45.4%
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format correlation value
 * Example: +0.62, -0.14
 */
export function formatCorrelation(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
}

/**
 * Get correlation strength description
 */
export function getCorrelationStrength(value: number): string {
  const abs = Math.abs(value);
  if (abs > 0.5) return 'Strong';
  if (abs > 0.3) return 'Moderate';
  if (abs > 0.1) return 'Weak';
  return 'Very weak';
}

/**
 * Get correlation direction description
 */
export function getCorrelationDirection(value: number): string {
  if (value > 0.1) return 'Positive';
  if (value < -0.1) return 'Negative';
  return 'No clear';
}
