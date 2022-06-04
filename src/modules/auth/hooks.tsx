import React from "react";

import { AuthContext, AuthData } from "./provider";

export const useIsAuthenticated = () => {
  const { authData } = React.useContext(AuthContext);
  return !!authData?.isAuthenticated;
};

export const useAuthToken = () => {
  const { authData } = React.useContext(AuthContext);
  return authData?.token;
};

export const useAuthRefreshToken = () => {
  const { authData } = React.useContext(AuthContext);
  return authData?.refreshToken;
};

export const useSetAuth = () => {
  const { updateAuthData } = React.useContext(AuthContext);
  return (data: AuthData) => updateAuthData(data);
};

export const useClearAuth = () => {
  const { clearAuthData } = React.useContext(AuthContext);
  return () => clearAuthData();
};

export const useAuthPayload = () => {
  const { authData } = React.useContext(AuthContext);
  return authData?.payload;
};
