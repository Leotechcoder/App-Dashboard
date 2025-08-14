export const formatPrice = (price) => {
  if (price == null) return 0;
  const cleaned = String(price)
    .replace("$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number.parseFloat(cleaned) || 0;
};