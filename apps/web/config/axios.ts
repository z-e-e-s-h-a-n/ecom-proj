/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import envConfig from "./envConfig";

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const API = axios.create({
  baseURL: envConfig.server.endpoint,
  withCredentials: true,
});

export const defaultApiResponse: IApiResponse = {
  success: false,
  message: "",
  data: null,
};

export const apiRequest = async <T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  payload?: any
): Promise<IApiResponse<T>> => {
  try {
    const response = await API.request({
      method,
      url,
      data: payload,
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw defaultApiResponse;
    }
  }
};

export default API;
