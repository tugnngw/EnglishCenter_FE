/**
 * ExamRoomPage — Phòng thi trực tuyến Client Portal (lượt thi thật, không còn MOCK_EXAM)
 */

import React from "react";
import { useParams } from "react-router-dom";
import { ExamRoomView } from "../features/exams";

export const ExamRoomPage: React.FC = () => {
  const { attemptId = "" } = useParams<{ attemptId: string }>();
  return <ExamRoomView attemptId={attemptId} />;
};

export default ExamRoomPage;
