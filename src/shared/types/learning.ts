import type {
  Course,
  CourseSection,
  Lesson,
  CertificateType,
  Mentor,
} from "./course";

export type LearningStatus = "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";

export interface CourseProgress {
  percent: number;
  completedLessonIds: string[];
  currentLessonId: string;
  studiedHours: number;
  status: LearningStatus;
  enrolledAt: string;
  completedAt?: string;
}

export interface EnrolledCourse {
  course: Course;
  progress: CourseProgress;
  nextLesson: Lesson;
  mentor: Mentor;
}

export type StudyTabKey = "overview" | "vocabulary" | "homework";

export interface StudyMaterial {
  id: string;
  title: string;
  fileName: string;
  fileType: "pdf" | "docx" | "mp4" | "zip";
  sizeKb: number;
}

export interface StudyHomework {
  id: string;
  prompt: string;
  dueLabel: string;
  dueAt: string;
  gradedScore?: number;
  gradedFeedback?: string;
  studentAnswer?: string;
  attachments?: { name: string; sizeKb: number }[];
}

export interface StudyLesson {
  lesson: Lesson;
  section: CourseSection;
  summary: string[];
  materials: StudyMaterial[];
  vocabulary: {
    word: string;
    ipa: string;
    partOfSpeech: string;
    meaning: string;
    example: string;
  }[];
  homework?: StudyHomework;
}

export interface LearningStats {
  inProgressCourses: number;
  studiedHours: number;
  pendingHomeworks: number;
}

export type MyCoursesFilter = "all" | "in-progress" | "completed";

export const CERT_LABEL: Record<CertificateType, string> = {
  IELTS: "IELTS Academic",
  TOEIC: "TOEIC",
  VSTEP: "VSTEP B1-B2",
};
