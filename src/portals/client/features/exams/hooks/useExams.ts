/**
 * useExams — danh sách đề, chi tiết đề, lịch sử thi, kết quả (TanStack Query).
 */

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "@/shared/constants/queryKeys";
import { ROUTES } from "@/shared/constants/routes";
import type { ApiError, AttemptDetail, AttemptResult, AttemptSummary, ExamDetail, ExamSummary, ServerPage } from "@/shared/types";
import {
  getAttemptResult,
  getExamDetail,
  getMyAttempts,
  getPublishedExams,
  startAttempt,
  type ExamListFilters,
} from "../api/exam.api";

export function useExamList(filters: ExamListFilters) {
  return useQuery<ServerPage<ExamSummary>, ApiError>({
    queryKey: queryKeys.examList({ ...filters }),
    queryFn: () => getPublishedExams(filters),
    placeholderData: keepPreviousData,
  });
}

export function useExamDetail(examId: string) {
  return useQuery<ExamDetail, ApiError>({
    queryKey: queryKeys.examDetail(examId),
    queryFn: () => getExamDetail(examId),
    enabled: Boolean(examId),
    retry: false,
  });
}

/** Bắt đầu (hoặc tiếp tục) lượt thi rồi chuyển vào phòng thi. */
export function useStartAttempt() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<AttemptDetail, ApiError, string>({
    mutationFn: startAttempt,
    onSuccess: (attempt) => {
      queryClient.setQueryData(queryKeys.examAttempt(attempt.attemptId), attempt);
      queryClient.invalidateQueries({ queryKey: ["exam-attempts", "me"] });
      navigate(ROUTES.EXAM_ATTEMPT(attempt.attemptId));
    },
  });
}

export function useMyAttempts(page: number) {
  return useQuery<ServerPage<AttemptSummary>, ApiError>({
    queryKey: queryKeys.myExamAttempts({ page }),
    queryFn: () => getMyAttempts(page),
    placeholderData: keepPreviousData,
  });
}

export function useAttemptResult(attemptId: string) {
  return useQuery<AttemptResult, ApiError>({
    queryKey: queryKeys.examAttemptResult(attemptId),
    queryFn: () => getAttemptResult(attemptId),
    enabled: Boolean(attemptId),
    retry: false,
  });
}
