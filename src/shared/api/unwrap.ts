import type { ServerResponse } from "@/shared/types/api";

/**
 * Lấy `result` từ envelope { code, message, result } của Spring Boot.
 * Lỗi HTTP đã được interceptors chuẩn hóa thành ApiError nên ở đây chỉ còn ca thành công.
 */
export function unwrapResult<T>(body: ServerResponse<T>): T {
  return body.result;
}
