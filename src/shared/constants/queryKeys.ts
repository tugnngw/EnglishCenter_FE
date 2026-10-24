/**
 * Query Keys — khai báo tập trung, không viết chuỗi rải rác.
 */
export const queryKeys = {
  courses: ["courses"] as const,
  courseDetail: (id: string) => ["courses", id] as const,
  exams: ["exams"] as const,
  examList: (filters: Record<string, unknown>) => ["exams", "list", filters] as const,
  examDetail: (id: string) => ["exams", id] as const,
  examAttempt: (attemptId: string) => ["exam-attempts", attemptId] as const,
  examAttemptResult: (attemptId: string) => ["exam-attempts", attemptId, "result"] as const,
  myExamAttempts: (filters: Record<string, unknown>) => ["exam-attempts", "me", filters] as const,
  examGradingQueue: (page: number) => ["exam-grading", "pending", page] as const,
  examGradingAttempt: (attemptId: string) => ["exam-grading", attemptId] as const,
  adminExams: (filters: Record<string, unknown>) => ["admin", "exams", filters] as const,
  adminExamDetail: (examId: string) => ["admin", "exams", examId] as const,
  certificates: ["certificates"] as const,
  adminCourseOptions: ["admin", "course-options"] as const,
  enrollments: ["enrollments"] as const,
  myProfile: ["me"] as const,
  schedules: ["schedules"] as const,
  submissions: (courseId: string) => ["submissions", courseId] as const,
};
