/**
 * ClientRoutes — Module định tuyến độc lập của Client Portal.
 *
 * MUST đường dẫn tương đối (mount tại "/*" trong AppRouter).
 * MUST export default function ClientRoutes để lazy loading hoạt động.
 */

import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ClientLayout } from "./layouts/ClientLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { ROLES } from "@/shared/constants/roles";
import ExamListPage from "./pages/ExamListPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import ExamRoomPage from "./pages/ExamRoomPage";
import ExamResultPage from "./pages/ExamResultPage";
import ExamHistoryPage from "./pages/ExamHistoryPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import StudyRoomPage from "./pages/StudyRoomPage";
import SchedulePage from "./pages/SchedulePage";
import LearningPathPage from "./pages/LearningPathPage";

const DEFAULT_COURSE = "ielts-intensive-mastery";

export default function ClientRoutes() {
  return (
    <Routes>
      {/* Auth routes — full bleed, không bọc ClientLayout */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* Workspace pages — trong ClientLayout */}
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="courses"
          element={<Navigate to={`/courses/${DEFAULT_COURSE}`} replace />}
        />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="exams" element={<ExamListPage />} />
        <Route path="exams/:id" element={<ExamDetailPage />} />
        {/* Làm bài / kết quả / lịch sử: backend chỉ cho role USER, STUDENT */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.USER, ROLES.STUDENT]} />}>
          <Route path="exams/history" element={<ExamHistoryPage />} />
          <Route path="exams/attempts/:attemptId" element={<ExamRoomPage />} />
          <Route path="exams/attempts/:attemptId/result" element={<ExamResultPage />} />
        </Route>
        <Route path="study/:slug" element={<StudyRoomPage />} />
        <Route path="study/:slug/:lessonId" element={<StudyRoomPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="learning-path" element={<LearningPathPage />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
        <Route path="my-learning" element={<MyCoursesPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
