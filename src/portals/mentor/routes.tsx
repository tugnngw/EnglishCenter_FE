/**
 * MentorRoutes — Module định tuyến độc lập của Mentor Portal
 *
 * MUST đường dẫn tương đối (mount tại "/mentor/*" trong AppRouter).
 * MUST export default function MentorRoutes để lazy loading hoạt động.
 */

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ROLES } from "@/shared/constants/roles";
import { MentorLayout } from "./layouts/MentorLayout";
import MentoringDashboardPage from "./pages/MentoringDashboardPage";
import GradingPage from "./pages/GradingPage";
import ExamGradingPage from "./pages/ExamGradingPage";

export default function MentorRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.MENTOR, ROLES.ADMIN]} />}>
        <Route element={<MentorLayout />}>
          <Route index element={<MentoringDashboardPage />} />
          <Route path="grading" element={<GradingPage />} />
          <Route path="assignments" element={<GradingPage />} />
          <Route path="exam-grading" element={<ExamGradingPage />} />
          <Route path="*" element={<Navigate to="/mentor" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
