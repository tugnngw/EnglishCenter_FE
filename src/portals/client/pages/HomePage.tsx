/**
 * HomePage — Điểm vào chính của Client Portal
 * Chuyển hướng mặc định tới khóa học flagship (Gold Flow)
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

const DEFAULT_COURSE = "ielts-intensive-mastery";

export const HomePage: React.FC = () => {
  return <Navigate to={ROUTES.COURSE_DETAIL(DEFAULT_COURSE)} replace />;
};

export default HomePage;
