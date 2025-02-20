import { getVariant } from "@/lib/utils";
import { useCurrency } from "./useCurrency";

const usePricing = () => {
  const { currencyInfo } = useCurrency();
  if (!currencyInfo) throw new Error("Currency Not Found");
  const { multiplier, currency, symbol } = currencyInfo;

  const formatProductPrice = (pricing: IVariant["pricing"]) => {
    const currentPricing =
      pricing.find((p) => p.currencyId.currency === currency) ||
      pricing.find((p) => p.currencyId.currency === "USD");
    if (!currentPricing) throw new Error("No fallback USD pricing");

    const format = (value: number) => parseFloat(value.toFixed(2));
    const priceWithMultiplier = (price: number) => format(price * multiplier);
    const formatWithSymbol = (price: number) => `${symbol}${format(price)}`;

    const original = priceWithMultiplier(currentPricing.original);
    const sale = currentPricing.sale
      ? priceWithMultiplier(currentPricing.sale)
      : undefined;
    const finalPrice = sale || original;

    return {
      sale: sale ? format(sale) : 0,
      original: format(original),
      symbol,
      price: format(finalPrice),
      fmtPrice: formatWithSymbol(finalPrice),
      fmtOriginal: formatWithSymbol(original),
      fmtSale: sale ? formatWithSymbol(sale) : null,
      multiplier: (price: number, quantity: number, retAsNumber = false) => {
        const total = format(price * quantity);
        return retAsNumber ? total : formatWithSymbol(total);
      },
    };
  };

  const calcCartSubtotal = (data: ICartItem[]) =>
    data?.reduce((sum, item) => {
      const pricing = getVariant(item.productId, item.variantId).pricing;
      const { price } = formatProductPrice(pricing);
      return sum + price * item.quantity;
    }, 0);

  return { formatProductPrice, calcCartSubtotal };
};

export default usePricing;
