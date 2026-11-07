export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatSigned(value: number, digits = 0) {
  const body = formatNumber(Math.abs(value), digits);
  if (value > 0) return `+${body}`;
  if (value < 0) return `−${body}`;
  return body;
}

export function formatPercentFromDecimal(value: number, digits = 2) {
  return `${formatSigned(value * 100, digits)}%`;
}
