import { jwtDecode } from "jwt-decode";

export const verifyToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

