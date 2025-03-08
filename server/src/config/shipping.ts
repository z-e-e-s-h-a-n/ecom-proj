import {
  TCalcShippingSchema,
  TShippingMethodSchema,
} from "@workspace/shared/schemas/shipping";

export const calcShippingCost = (
  method: TShippingMethodSchema,
  item: TCalcShippingSchema["items"][number]
): number => {
  const { weight, dimensions, quantity } = item;

  const convert = (value: number, unit: string, factor: number) =>
    unit === "in" || unit === "g" ? value * factor : value;

  const weightInKg = Number(
    (convert(weight.value, weight.unit, 1 / 1000) * quantity).toFixed(2)
  );

  const lengthInCm = convert(dimensions.length, dimensions.unit, 2.54);
  const widthInCm = convert(dimensions.width, dimensions.unit, 2.54);
  const heightInCm = convert(dimensions.height, dimensions.unit, 2.54);

  const volume = Number(
    (lengthInCm * widthInCm * heightInCm * quantity).toFixed(2)
  );

  const pricing = method.rates.find(
    ({ weight: w, volume: v }) =>
      weightInKg >= w.min &&
      weightInKg <= w.max &&
      volume >= v.min &&
      volume <= v.max
  );

  return pricing?.price ?? 0;
};

export const meetsFreeShipping = (
  method: TShippingMethodSchema,
  item: TCalcShippingSchema["items"][number]
): boolean => {
  const { freeShipping } = method;

  if (!freeShipping || !freeShipping.isActive) return false;

  // Check period
  if (freeShipping.duration) {
    const now = new Date();
    if (now < freeShipping.duration.start || now > freeShipping.duration.end)
      return false;
  }

  // Check criteria
  if (
    freeShipping.condition.type === "min" &&
    item.price < freeShipping.condition.threshold
  )
    return false;

  // Check applicability
  if (freeShipping.scope === "specific") {
    const isApplicableToProducts = freeShipping.products?.some(
      (id) => id.toString() === item.productId
    );
    const isApplicableToCategories = freeShipping.categories?.some(
      (id) => id.toString() === item.categoryId
    );

    if (!isApplicableToProducts && !isApplicableToCategories) return false;
  }

  return true;
};
