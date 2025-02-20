import { apiRequest } from "@/config/axios";
import { getVariant } from "@/lib/utils";

export interface FilteredProductsResponse {
  products: { product: IProduct }[];
  total: number;
  page: number;
  limit: number;
}

export const getProducts = async (
  params?: TSearchParams
): Promise<FilteredProductsResponse> => {
  const response = await apiRequest("GET", "/products", { params });
  return response.data;
};

export const getProduct = async (productId: string): Promise<IProduct> => {
  const response = await apiRequest("GET", `/products/${productId}`);
  return response.data.product as IProduct;
};

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await apiRequest("GET", "/products/categories");
  return response.data.categories;
};

export const getAttributes = async (
  categories?: string[]
): Promise<IAttribute[]> => {
  const response = await apiRequest("GET", "/products/attributes", {
    params: { categories },
  });
  return response.data.attributes;
};

export const getCurrencyInfo = async (
  currency?: string
): Promise<ICurrencyOption> => {
  const response = await apiRequest("GET", `/products/currency/${currency}`);
  return response.data.currencyInfo;
};

export const getAllCurrencies = async (): Promise<ICurrencyOption[]> => {
  const response = await apiRequest("GET", `/products/currency`);
  return response.data.currencies;
};

export const getShippingMethods = async (
  countries: ICurrencyOption["countries"]
): Promise<IShippingMethod> => {
  const response = await apiRequest("GET", `/shipping/method`, {
    data: countries,
  });
  return response.data.shippingMethod;
};

export const calculateShipping = async (
  items: ICartItem[],
  currencyInfo: ICurrencyOption
): Promise<number> => {
  const payload = items.map(({ productId, quantity, variantId }) => {
    const variant = getVariant(productId, variantId);
    const pricing = variant.pricing.find(
      (p) => p.currencyId.currency === currencyInfo.currency
    )!;

    return {
      name: productId.name,
      quantity,
      price: (pricing?.sale ?? pricing?.original) || 0,
      category: productId.category,
    };
  });

  const response = await apiRequest("POST", `/shipping/calculate`, {
    data: {
      items: payload,
      countries: currencyInfo.countries,
    },
  });
  return response.data.shippingCost;
};
