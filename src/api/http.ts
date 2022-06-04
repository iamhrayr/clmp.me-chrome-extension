import axios from "axios";

import { clearLocalStorageAuth } from "../modules/auth/provider";

import storageService from "../services/storageService";

const BASE_URL = "http://localhost:3000/";
// process.env.NODE_ENV === "development"
//   ? "http://localhost:3000/"
//   : "https://clmp.me/";

const http = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use(
  async (config) => {
    const { token } = await storageService.get();
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
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

http.interceptors.response.use(
  async (config) => {
    return config;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error.response) {
      if (error.response.data.statusCode === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const existingTokens = await getTokensFromLocalStorage();
          const response = await axios.post(`${BASE_URL}auth/refresh`, {
            accessToken: existingTokens.token,
            refreshToken: existingTokens.refreshToken,
          });
          const { token, refreshToken } = response.data;
          await setTokensIntoLocalStorage({ token, refreshToken });
          return http(originalConfig);
        } catch (error) {
          clearLocalStorageAuth();
          chrome.runtime.reload();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error.response.data);
    } else {
      Promise.reject(error);
    }
  }
);

async function getTokensFromLocalStorage(): Promise<{
  token?: string;
  refreshToken?: string;
}> {
  const { token, refreshToken } = await storageService.get();
  return { token, refreshToken };
}

async function setTokensIntoLocalStorage({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) {
  await storageService.set({
    token,
    refreshToken,
  });
}

export default http;
