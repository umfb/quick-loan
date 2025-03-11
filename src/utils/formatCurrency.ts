export function currencyFormatter(value: string): string {
  const numberValue = parseFloat(value);
  return `NGN ${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
  }).format(numberValue)}`;
}
