import { getVariant } from "@/lib/utils";
import { useCurrency } from "./useCurrency";

const usePricing = () => {
  const { currencyInfo } = useCurrency();
  if (!currencyInfo) throw new Error("Currency Not Found");

  const { multiplier, currency, symbol } = currencyInfo;

  const format = (value: number) => parseFloat(value.toFixed(2));
  const formatCurrency = (price: number) => `${symbol}${format(price)}`;

  const applyMultiplier = (price: number, pCurrency: string) =>
    pCurrency === currency ? price : price * multiplier;

  const formatProductPrice = (pricing: IVariant["pricing"]) => {
    let cPricing = pricing.find((p) => p.currencyId.currency === currency);
    if (!cPricing)
      cPricing = pricing.find((p) => p.currencyId.currency === "USD");
    if (!cPricing)
      throw new Error(`No pricing found for currency: ${currency}`);

    const original = format(
      applyMultiplier(cPricing.original, cPricing.currencyId.currency)
    );
    const sale = cPricing.sale
      ? format(applyMultiplier(cPricing.sale, cPricing.currencyId.currency))
      : null;
    const finalPrice = sale ?? original;

    return {
      sale,
      original,
      symbol,
      price: finalPrice,
      fmtPrice: formatCurrency(finalPrice),
      fmtOriginal: formatCurrency(original),
      fmtSale: sale ? formatCurrency(sale) : null,
      multiplier: (price: number, quantity: number, retAsNumber = false) => {
        const total = format(price * quantity);
        return retAsNumber ? total : formatCurrency(total);
      },
    };
  };

  const getCartSubtotal = (items: ICartItem[]) => {
    const subtotal =
      items?.reduce((sum, item) => {
        const pricing = getVariant(item.productId, item.variantId)?.pricing;
        if (!pricing) return sum;

        const { price } = formatProductPrice(pricing);
        return sum + price * item.quantity;
      }, 0) ?? 0;

    return { subtotal, fmtSubtotal: formatCurrency(subtotal) };
  };

  return { formatProductPrice, getCartSubtotal, formatCurrency };
};

export default usePricing;
