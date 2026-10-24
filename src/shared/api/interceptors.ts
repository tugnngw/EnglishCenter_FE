import type { AxiosInstance, AxiosError } from "axios";
import type { ApiError } from "@/shared/types/api";

const TOKEN_KEY = "access_token";

/**
 * Interceptors — chuẩn hóa lỗi thành ApiError { status, message }
 * để UI chỉ xử lý một dạng.
 */
export function setupInterceptors(client: AxiosInstance) {
  // Request: gắn token
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response: chuẩn hoá lỗi
  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        // TODO: refresh token hoặc redirect login
      }

      const apiError: ApiError = {
        status: error.response?.status ?? 0,
        message:
          (error.response?.data as { message?: string })?.message ??
          error.message ??
          "Lỗi không xác định",
        code: (error.response?.data as { code?: number })?.code,
      };

      return Promise.reject(apiError);
    },
  );
}
