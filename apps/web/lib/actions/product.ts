import { apiRequest } from "@/config/axios";
import { IApiResponse } from "@/config/axios";

export const getProducts = async (): Promise<IApiResponse> => {
  const response = await apiRequest("GET", "/products");
  return response.data.products;
};

export const getProduct = async (productId: string): Promise<IApiResponse> => {
  const response = await apiRequest("GET", `/products/${productId}`);
  return response.data.product;
};
