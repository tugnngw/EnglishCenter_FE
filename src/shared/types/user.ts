import type { Role } from "@/shared/constants/roles";

/** Thông tin người dùng — khớp DTO từ Spring Boot */
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}
