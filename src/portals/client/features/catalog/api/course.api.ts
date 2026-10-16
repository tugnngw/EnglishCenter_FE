/**
 * Course API — Tương tác API khóa học cho Client Portal
 */

import { axiosClient } from "@/shared/api/axiosClient";
import type { ApiResponse, Course } from "@/shared/types";
import { successResponse } from "@/shared/types";
import { MOCK_COURSE } from "@/shared/mocks";

export async function fetchCoursesApi(): Promise<ApiResponse<Course[]>> {
  try {
    const res = await axiosClient.get<{ code?: number; result?: Course[] }>(
      "/v1/courses",
    );
    if (res.data?.result && res.data.result.length > 0) {
      return successResponse(res.data.result, "Lấy danh sách khóa học thành công");
    }
  } catch {
    /* Fallback to mock data */
  }
  return successResponse([MOCK_COURSE], "Lấy danh sách khóa học (Mock)");
}

export async function fetchCourseByIdOrSlugApi(
  idOrSlug: string,
): Promise<ApiResponse<Course>> {
  try {
    const res = await axiosClient.get<{ code?: number; result?: Course }>(
      `/v1/courses/${idOrSlug}`,
    );
    if (res.data?.result) {
      return successResponse(res.data.result, "Lấy chi tiết khóa học thành công");
    }
  } catch {
    /* Fallback to mock data */
  }
  return successResponse(MOCK_COURSE, "Lấy chi tiết khóa học (Mock)");
}
