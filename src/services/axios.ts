import { BASE_URL } from "@/constants/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/localStorage";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next/client";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

interface Tokens {
  access: string;
  refresh: string;
}

const refreshToken = async (refresh: string) => {
  const { data } = await axios.post<Tokens>(`${BASE_URL}/api/token/refresh`, {
    refresh: refresh,
  });

  return data;
};

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = getCookie(ACCESS_TOKEN) ?? "";

  const { exp = 0 } = jwtDecode(accessToken);

  const now = Date.now() / 1000;

  if (now > exp) {
    const refresh = getCookie(REFRESH_TOKEN) ?? "";

    const { access, refresh: newRefresh } = await refreshToken(refresh);

    accessToken = access;

    setCookie(ACCESS_TOKEN, access);
    setCookie(REFRESH_TOKEN, newRefresh);
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;
