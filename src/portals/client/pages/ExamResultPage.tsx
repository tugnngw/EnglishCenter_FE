/**
 * ExamResultPage — Kết quả một lượt thi
 */

import React from "react";
import { useParams } from "react-router-dom";
import { AttemptResultView } from "../features/exams";

export const ExamResultPage: React.FC = () => {
  const { attemptId = "" } = useParams<{ attemptId: string }>();
  return <AttemptResultView attemptId={attemptId} />;
};

export default ExamResultPage;
