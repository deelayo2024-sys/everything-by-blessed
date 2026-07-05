export function formatNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "₦40,000+";
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
