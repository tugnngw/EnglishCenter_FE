/**
 * Request DTO của Admin cho module Exam (khớp CreateExamRequest, CreateExamSectionRequest,
 * CreateExamQuestionRequest, QuestionOptionRequest của Spring Boot).
 */

import type { DifficultyLevel, ExamScope, ExamStatus, ExamType, QuestionType } from "@/shared/types";

export interface CreateExamRequest {
  examScope: ExamScope;
  certificateId?: string;
  courseId?: string;
  examCode?: string;
  examType?: ExamType;
  examTitle: string;
  description?: string;
  durationMinutes: number;
  passingScore?: number;
  maxAttempts?: number;
  showAnswers?: boolean;
  showScore?: boolean;
  isFree?: boolean;
  price?: number;
  difficultyLevel?: DifficultyLevel;
  recommendedLevel?: string;
}

export interface CreateSectionRequest {
  title: string;
  sectionType?: string;
  instructions?: string;
  passageText?: string;
  audioUrl?: string;
}

export interface QuestionOptionInput {
  optionText: string;
  isCorrect?: boolean;
}

export interface CreateQuestionRequest {
  questionType: QuestionType;
  questionText: string;
  points?: number;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  sectionId?: string;
  timeLimitSeconds?: number;
  options?: QuestionOptionInput[];
}

export interface AdminExamFilters {
  keyword?: string;
  status?: ExamStatus;
  page: number;
}

export interface CertificateOption {
  certificateId: string;
  certificateName: string;
}

export interface CourseOption {
  courseId: string;
  title: string;
}
