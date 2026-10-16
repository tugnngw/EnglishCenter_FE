/**
 * Chuẩn DTO API Response dùng chung cho toàn bộ dự án.
 * Mọi endpoint Backend đều trả về theo cấu trúc ApiResponse<T>.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

export interface ApiError {
  status: number;
  message: string;
}

/** Phân trang chuẩn Spring Boot Page<T> */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/** Helper tạo ApiResponse thành công — dùng cho mock data. */
export function successResponse<T>(data: T, message = "Success"): ApiResponse<T> {
  return { success: true, message, data };
}

/** Helper tạo ApiResponse thất bại — dùng cho mock lỗi. */
export function errorResponse<T = null>(
  message: string,
  errorCode = "UNKNOWN_ERROR",
  data: T = null as T,
): ApiResponse<T> {
  return { success: false, message, data, errorCode };
}
