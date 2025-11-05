// src/lib/formatters.ts

/**
 * Formats a number as USD currency.
  * Example: formatCurrency(1234.5) → "$1,234.50"
   */
export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return "$0.00"
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value)
}

/**
 * Formats a percentage.
  * Example: formatPercent(0.25) → "25%"
   */
export function formatPercent(value: number | null | undefined, decimals = 0): string {
    if (value === null || value === undefined || isNaN(value)) return "0%"
    return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Formats a number with thousand separators.
  * Example: formatNumber(12345.678) → "12,345.68"
   */
export function formatNumber(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) return "0"
    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * Parses a numeric string safely.
  * Example: parseNumber("1,234.56") → 1234.56
   */
export function parseNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0
    const num = typeof value === "number" ? value : parseFloat(value.replace(/,/g, ""))
    return isNaN(num) ? 0 : num
}

/**
 * Rounds a number to N decimals.
  * Example: roundTo(3.14159, 2) → 3.14
   */
export function roundTo(value: number, decimals = 2): number {
    return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Formats pay values depending on pay type.
 * - "hourly" → "$25.00"
 * - "board_foot" → "$0.18 / BF"
 * - "job_based" → "15%"
 */
export function formatPayValue(value: number | null | undefined, payType: string): string {
  if (value === null || value === undefined || isNaN(value)) return ""

  switch (payType) {
    case "hourly":
      return `${formatCurrency(value)}`
    case "board_foot":
      return `${formatCurrency(value)} / BF`
    case "job_based":
      return `${value.toFixed(2)}%`
    default:
      return value.toString()
  }
}
