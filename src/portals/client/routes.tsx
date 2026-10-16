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
import ExamRoomPage from "./pages/ExamRoomPage";
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
        <Route path="exams/:id" element={<ExamRoomPage />} />
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
