/**
 * Enrollment Store (Zustand)
 * Lưu trạng thái ghi danh của học viên phía client.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle?: string;
  userId: string;
  status: "ACTIVE" | "EXPIRED" | "REFUNDED";
  enrolledAt: string;
  expiresAt?: string;
  meta?: Record<string, unknown>;
}

export interface EnrollPayload {
  courseId: string;
  courseTitle?: string;
  userId: string;
  amount?: number;
  meta?: Record<string, unknown>;
}

interface EnrollmentState {
  enrolled: Record<string, Enrollment>;
  isLoading: boolean;
  error: string | null;

  enroll: (payload: EnrollPayload) => Enrollment;
  getByCourse: (courseId: string) => Enrollment | undefined;
  subscribe: (listener: (state: EnrollmentState) => void) => () => void;
  reset: () => void;
}

const initialState = {
  enrolled: {} as Record<string, Enrollment>,
  isLoading: false,
  error: null,
};

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      enroll: (payload) => {
        const enrollment: Enrollment = {
          id: `enr_${Date.now()}`,
          courseId: payload.courseId,
          courseTitle: payload.courseTitle,
          userId: payload.userId,
          status: "ACTIVE",
          enrolledAt: new Date().toISOString(),
          meta: payload.meta,
        };
        set((s) => ({
          enrolled: { ...s.enrolled, [payload.courseId]: enrollment },
        }));
        return enrollment;
      },

      getByCourse: (courseId) => get().enrolled[courseId],

      subscribe: (listener) => {
        return useEnrollmentStore.subscribe(listener);
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: "prepmaster-ai-enrollments",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectIsEnrolled = (courseId: string) => (s: EnrollmentState) =>
  Boolean(s.enrolled[courseId]);

export const selectEnrollment = (courseId: string) => (s: EnrollmentState) =>
  s.enrolled[courseId];
