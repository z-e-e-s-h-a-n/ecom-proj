export const getLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : fallback;
};

export const updateLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const getVariant = (product: IProduct, variantId?: string) =>
  product.variations.reduce(
    (selected, variant) => (variant._id === variantId ? variant : selected),
    product.variations.find((variant) => variant.isDefault)!
  );

export const getImages = (product: IProduct, variantId?: string) => {
  const variant = getVariant(product, variantId);
  const images = variant.images.length > 0 ? variant.images : product.images;
  return { images, image: images[0]! };
};

export const toggleFilter = (current: string[], value: string) => {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
};

export const formatSearchParams = (params: TSearchParams): string => {
  return `?${Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}=${v}`)
        : [`${key}=${value}`]
    )
    .join("&")}`;
};
