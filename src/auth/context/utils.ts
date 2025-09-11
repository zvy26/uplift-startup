import { paths } from "@/routes/paths";
import http from "@/services/api";

function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert("Token expired");

    localStorage.removeItem("access_token");

    window.location.href = paths.auth.jwt.login;
  }, timeLeft);
};

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);

    http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    delete http.defaults.headers.common.Authorization;
  }
};
