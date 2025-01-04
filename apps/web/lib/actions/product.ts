"use server";
import { apiRequest } from "@/config/axios";

export const getProducts = async (): Promise<IProduct[]> => {
  const response = await apiRequest("GET", "/products");
  return response.data.products;
};

export const getProduct = async (productId: string): Promise<IProduct> => {
  const response = await apiRequest("GET", `/products/${productId}`);
  return response.data.product;
};
