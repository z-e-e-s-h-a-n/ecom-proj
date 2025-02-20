/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import envConfig from "./env";

export interface IApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

const API = axios.create({
  baseURL: envConfig.server.endpoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Default API Response
export const defaultApiResponse: IApiResponse = {
  status: 500,
  success: false,
  message: "An unexpected error occurred.",
  data: null,
};

// API Request Function with Better Error Handling
export const apiRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: {
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
  } = {}
): Promise<IApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options,
    };

    const response: AxiosResponse<IApiResponse<T>> = await API.request(config);
    return response.data;
  } catch (error: any) {
    if (error.response.data) {
      return error.response.data;
    } else {
      throw defaultApiResponse;
    }
  }
};

// Axios Interceptors for Global Handling
API.interceptors.request.use(
  (config) => {
    const token = localStorage?.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
