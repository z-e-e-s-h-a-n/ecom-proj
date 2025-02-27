import { TShippingMethod, TShippingMethodPricing } from "@/models/shipping";

let evaluate: any;
(async () => {
  const mathjs = await import("mathjs");
  evaluate = mathjs.evaluate;
})();

interface CalculationContext {
  qty: number;
  cost: number;
}

const parseFeeFormula = (
  formula: string,
  context: CalculationContext
): number => {
  const feeRegex =
    /\[fee percent="(\d+)"(?: min_fee="(\d+)")?(?: max_fee="(\d+)")?\]/;
  const feeMatch = formula.match(feeRegex);

  if (!feeMatch) return 0;

  const [, percentStr, minFeeStr, maxFeeStr] = feeMatch;
  const percent = percentStr ? parseFloat(percentStr) : 0;
  const minFee = minFeeStr ? parseFloat(minFeeStr) : 0;
  const maxFee = maxFeeStr ? parseFloat(maxFeeStr) : Infinity;

  const fee = (percent / 100) * context.cost;
  return Math.max(minFee, Math.min(fee, maxFee));
};

export const evaluateCost = (
  formula: string,
  context: CalculationContext
): number => {
  if (formula.includes("[fee")) return parseFeeFormula(formula, context);

  const expression = formula
    .replace(/\[qty\]/g, context.qty.toString())
    .replace(/\[cost\]/g, context.cost.toString());

  try {
    return evaluate(expression);
  } catch (error) {
    console.error("Formula evaluation error:", error);
    throw new Error(`Failed to evaluate formula: ${formula}`);
  }
};

export const calcShippingCost = (
  pricing: TShippingMethodPricing,
  context: CalculationContext
): number => {
  if (!pricing) return 0;

  const { type, value } = pricing;
  return type === "formula" ? evaluateCost(value, context) : parseFloat(value);
};

export const meetsFreeShipping = (
  method: TShippingMethod,
  context: { subtotal: number; couponId?: string }
) => {
  const { requirements } = method;

  if (!requirements || requirements?.type === "none") return true;

  const conditions = {
    minAmount: context.subtotal >= (requirements.minAmount || 0),
    hasCoupon: context.couponId === requirements.couponId?.toString(),
  };

  switch (requirements.type) {
    case "minAmount":
      return conditions.minAmount;
    case "coupon":
      return conditions.hasCoupon;
    case "either":
      return conditions.minAmount || conditions.hasCoupon;
    default:
      return false;
  }
};
