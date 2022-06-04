import http from "./http";

export const shortifyUrl = async ({
  url,
  passcode,
}: {
  url: string;
  passcode?: string;
}): Promise<string> => {
  const { data } = await http.post("./urls", {
    url,
    passcode,
  });
  return data;
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  refreshToken: string;
  payload: {
    email: string;
    iat: number;
    exp: number;
  };
}> => {
  const res = await http.post("/auth/signin", {
    email,
    password,
  });
  return res.data;
};
