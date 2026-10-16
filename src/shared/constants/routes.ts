/**
 * Routes — đường dẫn khai báo tập trung, không viết chuỗi rải rác.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Client
  COURSES: "/courses",
  COURSE_DETAIL: (id: string) => `/courses/${id}` as const,
  EXAMS: "/exams",
  EXAM_ROOM: (id: string) => `/exams/${id}` as const,
  MY_LEARNING: "/my-learning",
  MY_COURSES: "/my-courses",
  STUDY_ROOM: (slug: string) => `/study/${slug}` as const,
  SCHEDULE: "/schedule",
  LEARNING_PATH: "/learning-path",

  // Namespaced aliases for client
  CLIENT: {
    HOME: "/",
    COURSES: "/courses",
    COURSE_DETAIL: (id: string) => `/courses/${id}` as const,
    EXAMS: "/exams",
    EXAM_ROOM: (id: string) => `/exams/${id}` as const,
    MY_LEARNING: "/my-learning",
    MY_COURSES: "/my-courses",
    STUDY_ROOM: (slug: string) => `/study/${slug}` as const,
    SCHEDULE: "/schedule",
    LEARNING_PATH: "/learning-path",
  },

  // Mentor
  MENTOR_HOME: "/mentor",
  MENTOR_GRADING: "/mentor/grading",
  MENTOR: {
    HOME: "/mentor",
    GRADING: "/mentor/grading",
  },

  // Admin
  ADMIN_HOME: "/admin",
  ADMIN_ACCOUNTS: "/admin/accounts",
  ADMIN_REVENUE: "/admin/revenue",
  ADMIN: {
    HOME: "/admin",
    ACCOUNTS: "/admin/accounts",
    REVENUE: "/admin/revenue",
  },
} as const;
