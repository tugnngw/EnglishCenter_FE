import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { ApiError, AttemptResult, AttemptSummary, ServerPage } from "@/shared/types";
import { getAttemptForGrading, getPendingAttempts, gradeAnswer, type GradeAnswerPayload } from "../api/examGrading.api";

export function usePendingAttempts(page: number) {
  return useQuery<ServerPage<AttemptSummary>, ApiError>({
    queryKey: queryKeys.examGradingQueue(page),
    queryFn: () => getPendingAttempts(page),
    placeholderData: keepPreviousData,
  });
}

export function useAttemptForGrading(attemptId: string | null) {
  return useQuery<AttemptResult, ApiError>({
    queryKey: queryKeys.examGradingAttempt(attemptId ?? ""),
    queryFn: () => getAttemptForGrading(attemptId ?? ""),
    enabled: Boolean(attemptId),
  });
}

/** Chấm một câu essay; cập nhật bài đang mở và làm mới hàng đợi. */
export function useGradeAnswer() {
  const queryClient = useQueryClient();
  return useMutation<AttemptResult, ApiError, GradeAnswerPayload>({
    mutationFn: gradeAnswer,
    onSuccess: (result, variables) => {
      queryClient.setQueryData(queryKeys.examGradingAttempt(variables.attemptId), result);
      queryClient.invalidateQueries({ queryKey: ["exam-grading", "pending"] });
    },
  });
}
