/**
 * Exam Management API — Admin quản lý đề, section, câu hỏi. Backend: Dev 3, prefix /api/v1/admin.
 * Danh mục chứng chỉ / khóa học lấy từ API public của Dev 2 (chỉ đọc).
 */

import { axiosClient, unwrapResult } from "@/shared/api";
import type { ExamDetail, ExamQuestion, ExamSection, ExamSummary, ServerPage, ServerResponse } from "@/shared/types";
import type {
  AdminExamFilters,
  CertificateOption,
  CourseOption,
  CreateExamRequest,
  CreateQuestionRequest,
  CreateSectionRequest,
} from "../types";

export async function getAdminExams(filters: AdminExamFilters): Promise<ServerPage<ExamSummary>> {
  const { data } = await axiosClient.get<ServerPage<ExamSummary>>("/v1/admin/exams", {
    params: { keyword: filters.keyword || undefined, status: filters.status, page: filters.page, size: 10 },
  });
  return data;
}

export async function getAdminExam(examId: string): Promise<ExamDetail> {
  const { data } = await axiosClient.get<ServerResponse<ExamDetail>>(`/v1/admin/exams/${examId}`);
  return unwrapResult(data);
}

export async function createExam(payload: CreateExamRequest): Promise<ExamDetail> {
  const { data } = await axiosClient.post<ServerResponse<ExamDetail>>("/v1/admin/exams", payload);
  return unwrapResult(data);
}

export async function deleteExam(examId: string): Promise<void> {
  await axiosClient.delete(`/v1/admin/exams/${examId}`);
}

export async function publishExam(examId: string): Promise<ExamDetail> {
  const { data } = await axiosClient.post<ServerResponse<ExamDetail>>(`/v1/admin/exams/${examId}/publish`);
  return unwrapResult(data);
}

export async function unpublishExam(examId: string): Promise<ExamDetail> {
  const { data } = await axiosClient.post<ServerResponse<ExamDetail>>(`/v1/admin/exams/${examId}/unpublish`);
  return unwrapResult(data);
}

export async function createSection(examId: string, payload: CreateSectionRequest): Promise<ExamSection> {
  const { data } = await axiosClient.post<ServerResponse<ExamSection>>(`/v1/admin/exams/${examId}/sections`, payload);
  return unwrapResult(data);
}

export async function deleteSection(examId: string, sectionId: string): Promise<void> {
  await axiosClient.delete(`/v1/admin/exams/${examId}/sections/${sectionId}`);
}

export async function addQuestion(examId: string, payload: CreateQuestionRequest): Promise<ExamQuestion> {
  const { data } = await axiosClient.post<ServerResponse<ExamQuestion>>(`/v1/admin/exams/${examId}/questions`, payload);
  return unwrapResult(data);
}

export async function removeQuestion(examId: string, questionId: string): Promise<void> {
  await axiosClient.delete(`/v1/admin/exams/${examId}/questions/${questionId}`);
}

export async function getCertificateOptions(): Promise<CertificateOption[]> {
  const { data } = await axiosClient.get<ServerResponse<CertificateOption[]>>("/v1/certificates");
  return unwrapResult(data);
}

export async function getCourseOptions(): Promise<CourseOption[]> {
  const { data } = await axiosClient.get<ServerPage<CourseOption>>("/v1/courses", { params: { size: 100 } });
  return data.data;
}
