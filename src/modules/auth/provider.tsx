import React from "react";

import storageService from "../../services/storageService";

export type AuthData = {
  token?: string | null;
  refreshToken?: string | null;
  isAuthenticated?: boolean;
  payload?: { [key: string]: any } | null;
};

export const AuthContext = React.createContext<{
  authData: AuthData | null;
  updateAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
}>({
  authData: {},
  updateAuthData: () => {},
  clearAuthData: () => {},
});

const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [authData, setAuthData] = React.useState<AuthData | null>({});

  React.useEffect(() => {
    (async () => {
      const data = await storageService.get();
      setAuthData(data);
    })();
  }, []);

  const updateAuthData = React.useCallback(async (data: AuthData) => {
    await storageService.set(data);
    setAuthData((prevState) => ({ ...prevState, ...data }));
  }, []);

  const clearAuthData = React.useCallback(async () => {
    setAuthData(null);
    await clearLocalStorageAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, updateAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export async function clearLocalStorageAuth() {
  await storageService.clear();
}

export default AuthProvider;
