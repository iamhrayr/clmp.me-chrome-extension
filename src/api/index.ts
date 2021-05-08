import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "http://clmp.me/";

const http = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else {
      Promise.reject(error);
    }
  }
);

export const shortifyUrl = async (url: string): Promise<string> => {
  const { data } = await http.post("./urls", {
    url,
  });
  return data;
};
