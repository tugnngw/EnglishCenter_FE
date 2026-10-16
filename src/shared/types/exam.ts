import type { ApiResponse } from "./api";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE_NOTGIVEN" | "FILL_BLANK";

export interface McqOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export type AnswerValue = string | boolean | null;

export interface Question {
  id: string;
  order: number;
  type: QuestionType;
  prompt: string;
  options?: McqOption[];
  correctAnswer: AnswerValue;
  explanation?: string;
}

export interface ExamPassage {
  id: string;
  title: string;
  paragraphs: { heading?: string; text: string }[];
}

export interface Exam {
  id: string;
  slug: string;
  title: string;
  skill: "READING" | "LISTENING" | "WRITING" | "SPEAKING";
  certificate: "IELTS" | "TOEIC" | "VSTEP";
  durationSeconds: number;
  totalQuestions: number;
  passages: ExamPassage[];
  questions: Question[];
}

export type ExamListResponse = ApiResponse<Exam[]>;
export type ExamDetailResponse = ApiResponse<Exam>;

export interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  bandScore: number;
  maxBand: number;
  feedback: string;
  perQuestion: { questionId: string; isCorrect: boolean; chosen: AnswerValue }[];
}
