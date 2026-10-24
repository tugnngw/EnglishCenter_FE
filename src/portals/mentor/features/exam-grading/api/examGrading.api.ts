/**
 * Exam Grading API — Mentor/Admin chấm Writing/Speaking. Backend: Dev 3.
 */

import { axiosClient, unwrapResult } from "@/shared/api";
import type { AttemptResult, AttemptSummary, ServerPage, ServerResponse } from "@/shared/types";

export interface GradeAnswerPayload {
  attemptId: string;
  questionId: string;
  score: number;
  feedback?: string;
}

export async function getPendingAttempts(page: number): Promise<ServerPage<AttemptSummary>> {
  const { data } = await axiosClient.get<ServerPage<AttemptSummary>>("/v1/mentor/exam-attempts/pending", {
    params: { page, size: 20 },
  });
  return data;
}

export async function getAttemptForGrading(attemptId: string): Promise<AttemptResult> {
  const { data } = await axiosClient.get<ServerResponse<AttemptResult>>(`/v1/mentor/exam-attempts/${attemptId}`);
  return unwrapResult(data);
}

export async function gradeAnswer({ attemptId, questionId, score, feedback }: GradeAnswerPayload): Promise<AttemptResult> {
  const { data } = await axiosClient.put<ServerResponse<AttemptResult>>(
    `/v1/mentor/exam-attempts/${attemptId}/answers/${questionId}/grade`,
    { score, feedback },
  );
  return unwrapResult(data);
}
