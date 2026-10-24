/**
 * AdminRoutes — Module định tuyến độc lập của Admin Portal
 *
 * MUST đường dẫn tương đối (mount tại "/admin/*" trong AppRouter).
 * MUST export default function AdminRoutes để lazy loading hoạt động.
 */

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ROLES } from "@/shared/constants/roles";
import { AdminLayout } from "./layouts/AdminLayout";
import CourseManagementPage from "./pages/CourseManagementPage";
import AccountManagementPage from "./pages/AccountManagementPage";
import RevenueReportPage from "./pages/RevenueReportPage";
import ExamManagementPage from "./pages/ExamManagementPage";
import ExamEditorPage from "./pages/ExamEditorPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<CourseManagementPage />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route path="exams" element={<ExamManagementPage />} />
          <Route path="exams/:examId" element={<ExamEditorPage />} />
          <Route path="accounts" element={<AccountManagementPage />} />
          <Route path="revenue" element={<RevenueReportPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
