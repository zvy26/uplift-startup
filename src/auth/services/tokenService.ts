import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { JWTUser } from "../types";

const ACCESS_TOKEN_STORAGE_KEY = "m_at";
const REFRESH_TOKEN_STORAGE_KEY = "m_rt";

export const tokenService = {
  getTokens() {
    const accessToken = cookies.get(ACCESS_TOKEN_STORAGE_KEY);
    const refreshToken = cookies.get(REFRESH_TOKEN_STORAGE_KEY);

    return {
      accessToken,
      refreshToken,
    };
  },
  decodeToken(): JWTUser | null {
    const token = this.getTokens().accessToken;
    if (!token) return null;

    try {
      return jwtDecode<JWTUser>(token);
    } catch (_) {
      return null;
    }
  },
};
