import config from "@/config";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const httpRequest = axios.create({
  baseURL: config.API.API_URL,
});

export const sleep = (ms = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

httpRequest.interceptors.request.use(async (value) => {
  // const storage = localStorage.getItem("user");
  // const user = storage ? JSON.parse(storage) : null;
  // value.headers["token"] = user.token ?? "";
  value.headers["token"] = `${localStorage.getItem("token")}`;
  return value;
});

httpRequest.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (error.response) {
    if (error.response.status === 401) {
      Cookies.remove("badminton-rft");
      Cookies.remove("badminton-at");
      sessionStorage.removeItem("badminton-session");
    }
    return Promise.reject(error.response.data);
  } else {
    throw new Error("Network Error");
  }
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
