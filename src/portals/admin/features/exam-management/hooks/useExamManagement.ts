import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/queryKeys";
import type { ApiError, ExamDetail, ExamSummary, ServerPage } from "@/shared/types";
import {
  addQuestion,
  createExam,
  createSection,
  deleteExam,
  deleteSection,
  getAdminExam,
  getAdminExams,
  getCertificateOptions,
  getCourseOptions,
  publishExam,
  removeQuestion,
  unpublishExam,
} from "../api/examManagement.api";
import type {
  AdminExamFilters,
  CertificateOption,
  CourseOption,
  CreateExamRequest,
  CreateQuestionRequest,
  CreateSectionRequest,
} from "../types";

const ADMIN_EXAMS_ROOT = ["admin", "exams"] as const;

export function useAdminExams(filters: AdminExamFilters) {
  return useQuery<ServerPage<ExamSummary>, ApiError>({
    queryKey: queryKeys.adminExams({ ...filters }),
    queryFn: () => getAdminExams(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAdminExam(examId: string) {
  return useQuery<ExamDetail, ApiError>({
    queryKey: queryKeys.adminExamDetail(examId),
    queryFn: () => getAdminExam(examId),
    enabled: Boolean(examId),
  });
}

export function useExamFormOptions() {
  const certificates = useQuery<CertificateOption[], ApiError>({
    queryKey: queryKeys.certificates,
    queryFn: getCertificateOptions,
  });
  const courses = useQuery<CourseOption[], ApiError>({
    queryKey: queryKeys.adminCourseOptions,
    queryFn: getCourseOptions,
  });
  return { certificates, courses };
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation<ExamDetail, ApiError, CreateExamRequest>({
    mutationFn: createExam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_EXAMS_ROOT }),
  });
}

/** Các thao tác trên một đề: mọi mutation thành công đều làm mới chi tiết đề và danh sách đề. */
export function useExamActions(examId: string) {
  const queryClient = useQueryClient();
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_EXAMS_ROOT });
    queryClient.invalidateQueries({ queryKey: queryKeys.exams });
  };
  return {
    publish: useMutation<ExamDetail, ApiError, void>({ mutationFn: () => publishExam(examId), onSuccess }),
    unpublish: useMutation<ExamDetail, ApiError, void>({ mutationFn: () => unpublishExam(examId), onSuccess }),
    remove: useMutation<void, ApiError, void>({ mutationFn: () => deleteExam(examId), onSuccess }),
    addSection: useMutation<unknown, ApiError, CreateSectionRequest>({
      mutationFn: (payload) => createSection(examId, payload),
      onSuccess,
    }),
    removeSection: useMutation<void, ApiError, string>({
      mutationFn: (sectionId) => deleteSection(examId, sectionId),
      onSuccess,
    }),
    addQuestion: useMutation<unknown, ApiError, CreateQuestionRequest>({
      mutationFn: (payload) => addQuestion(examId, payload),
      onSuccess,
    }),
    removeQuestion: useMutation<void, ApiError, string>({
      mutationFn: (questionId) => removeQuestion(examId, questionId),
      onSuccess,
    }),
  };
}
