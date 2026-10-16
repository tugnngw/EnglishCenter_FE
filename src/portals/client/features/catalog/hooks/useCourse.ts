/**
 * useCourse — TanStack Query hooks cho khóa học
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/queryKeys";
import {
  fetchCoursesApi,
  fetchCourseByIdOrSlugApi,
} from "../api/course.api";
import type { Course } from "@/shared/types";

export function useCourses() {
  return useQuery<Course[], Error>({
    queryKey: queryKeys.courses,
    queryFn: async () => {
      const res = await fetchCoursesApi();
      if (!res.success || !res.data) {
        throw new Error(res.message || "Không thể tải danh sách khóa học");
      }
      return res.data;
    },
  });
}

export function useCourseDetail(idOrSlug: string) {
  return useQuery<Course, Error>({
    queryKey: queryKeys.courseDetail(idOrSlug),
    queryFn: async () => {
      const res = await fetchCourseByIdOrSlugApi(idOrSlug);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Không thể tải chi tiết khóa học");
      }
      return res.data;
    },
    enabled: Boolean(idOrSlug),
  });
}
