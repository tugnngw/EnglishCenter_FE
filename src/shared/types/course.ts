import type { ApiResponse } from "./api";
import type { Role } from "@/shared/constants/roles";

export type CertificateType = "IELTS" | "TOEIC" | "VSTEP";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LessonStatus = "PREVIEW" | "LOCKED" | "ENROLLED";

export interface Mentor {
  id: string;
  fullName: string;
  avatarUrl?: string;
  title: string;
  rating: number;
  studentCount: number;
  experience: string;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  description?: string;
  durationMinutes: number;
  type: "VIDEO" | "READING" | "QUIZ" | "LIVE";
  status: LessonStatus;
}

export interface CourseSection {
  id: string;
  order: number;
  title: string;
  lessons: Lesson[];
}

export interface VocabularyCard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  certificate: CertificateType;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  durationHours: number;
  totalLessons: number;
  rating: number;
  ratingCount: number;
  studentEnrolled: number;
  thumbnailUrl: string;
  coverUrl: string;
  shortDescription: string;
  targetDescription: string;
  outcomes: string[];
  mentor: Mentor;
  curriculum: CourseSection[];
  vocabularyBank: VocabularyCard[];
  visibleTo?: Role[];
}

export type CourseListResponse = ApiResponse<Course[]>;
export type CourseDetailResponse = ApiResponse<Course>;
