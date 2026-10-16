/**
 * Assignment & Grading types for Mentor Portal
 */

export type SubmissionStatus = "PENDING" | "IN_REVIEW" | "GRADED";
export type SubmissionType = "WRITING" | "SPEAKING";

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentAvatar?: string;
  courseTitle: string;
  lessonTitle: string;
  type: SubmissionType;
  submittedAt: string;
  status: SubmissionStatus;
  essayContent?: string;
  audioDuration?: string;
  aiSuggestedBand?: number;
  mentorBand?: number;
  mentorFeedback?: string;
}

export interface MentorStats {
  pendingSubmissions: number;
  activeStudents: number;
  todaySessions: number;
  averageRating: number;
}
