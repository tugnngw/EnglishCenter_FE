/**
 * ExamDetailPage — Giới thiệu đề thi & bắt đầu làm bài
 */

import React from "react";
import { useParams } from "react-router-dom";
import { ExamIntroView } from "../features/exams";

export const ExamDetailPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  return <ExamIntroView examId={id} />;
};

export default ExamDetailPage;
