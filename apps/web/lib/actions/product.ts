import { apiRequest } from "@/config/axios";

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await apiRequest("GET", "/products");
  return response.data.products as IProduct[];
};

export const getProduct = async (productId: string): Promise<IProduct> => {
  const response = await apiRequest("GET", `/products/${productId}`);
  return response.data.product as IProduct;
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
