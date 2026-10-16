/**
 * Roles — khớp với role Spring Boot trả về trong JWT.
 * MUST dùng hằng ROLES, không hard-code chuỗi.
 */
export const ROLES = {
  GUEST: "GUEST",
  USER: "USER",
  STUDENT: "STUDENT",
  MENTOR: "MENTOR",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
