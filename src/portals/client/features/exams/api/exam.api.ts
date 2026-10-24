/**
 * Exam API — Client Portal (học viên làm bài). Backend: Dev 3, prefix /api/v1.
 */

import { axiosClient, unwrapResult } from "@/shared/api";
import type {
  AnswerItemRequest,
  AttemptDetail,
  AttemptResult,
  AttemptSummary,
  ExamDetail,
  ExamScope,
  ExamSummary,
  ExamType,
  ServerPage,
  ServerResponse,
} from "@/shared/types";

export interface ExamListFilters {
  keyword?: string;
  examType?: ExamType;
  examScope?: ExamScope;
  level?: string;
  page?: number;
  size?: number;
}

export async function getPublishedExams(filters: ExamListFilters): Promise<ServerPage<ExamSummary>> {
  const { data } = await axiosClient.get<ServerPage<ExamSummary>>("/v1/exams", {
    params: { ...filters, page: filters.page ?? 0, size: filters.size ?? 12 },
  });
  return data;
}

export async function getExamDetail(examId: string): Promise<ExamDetail> {
  const { data } = await axiosClient.get<ServerResponse<ExamDetail>>(`/v1/exams/${examId}`);
  return unwrapResult(data);
}

export async function startAttempt(examId: string): Promise<AttemptDetail> {
  const { data } = await axiosClient.post<ServerResponse<AttemptDetail>>(`/v1/exams/${examId}/attempts`);
  return unwrapResult(data);
}

export async function getAttempt(attemptId: string): Promise<AttemptDetail> {
  const { data } = await axiosClient.get<ServerResponse<AttemptDetail>>(`/v1/attempts/${attemptId}`);
  return unwrapResult(data);
}

export async function saveAnswers(attemptId: string, answers: AnswerItemRequest[]): Promise<AttemptDetail> {
  const { data } = await axiosClient.put<ServerResponse<AttemptDetail>>(
    `/v1/attempts/${attemptId}/answers`,
    { answers },
  );
  return unwrapResult(data);
}

export async function submitAttempt(attemptId: string, answers: AnswerItemRequest[]): Promise<AttemptResult> {
  const { data } = await axiosClient.post<ServerResponse<AttemptResult>>(
    `/v1/attempts/${attemptId}/submit`,
    answers.length > 0 ? { answers } : undefined,
  );
  return unwrapResult(data);
}

export async function getMyAttempts(page: number, examId?: string): Promise<ServerPage<AttemptSummary>> {
  const { data } = await axiosClient.get<ServerPage<AttemptSummary>>("/v1/me/exam-attempts", {
    params: { page, size: 10, examId },
  });
  return data;
}

export async function getAttemptResult(attemptId: string): Promise<AttemptResult> {
  const { data } = await axiosClient.get<ServerResponse<AttemptResult>>(
    `/v1/me/exam-attempts/${attemptId}/result`,
  );
  return unwrapResult(data);
}
