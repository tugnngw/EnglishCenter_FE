/**
 * Query Keys — khai báo tập trung, không viết chuỗi rải rác.
 */
export const queryKeys = {
  courses: ["courses"] as const,
  courseDetail: (id: string) => ["courses", id] as const,
  exams: ["exams"] as const,
  examDetail: (id: string) => ["exams", id] as const,
  enrollments: ["enrollments"] as const,
  myProfile: ["me"] as const,
  schedules: ["schedules"] as const,
  submissions: (courseId: string) => ["submissions", courseId] as const,
};
