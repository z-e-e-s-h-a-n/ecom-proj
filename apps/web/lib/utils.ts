export const getLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : fallback;
};

export const updateLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getVariant = (product: IProduct, variantId?: string) =>
  product.variations.reduce(
    (selected, variant) => (variant._id === variantId ? variant : selected),
    product.variations.find((variant) => variant.isDefault)!
  );

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
