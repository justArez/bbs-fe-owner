import config from "@/config";
import axios, { AxiosRequestConfig } from "axios";

const httpRequest = axios.create({
  baseURL: config.API.API_URL,
});

export const sleep = (ms = 100000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

httpRequest.interceptors.request.use(async (value) => {
  value.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  // const storage = localStorage.getItem("user");
  // const user = storage ? JSON.parse(storage) : null;
  // value.headers["token"] = user.token ?? "";
  return value;
});

export const get = async (path: string, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path: string, data?: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.post(path, data, options);
  return response.data;
};

export const patch = async (path: string, data: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.patch(path, data, options);
  return response.data;
};

export const put = async (path: string, data: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.put(path, data, options);
  return response.data;
};

export const remove = async (path: string, options: AxiosRequestConfig<object>) => {
  const response = await httpRequest.delete(path, options);
  return response.data;
};

export default httpRequest;
