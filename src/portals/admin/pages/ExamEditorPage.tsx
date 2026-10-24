/**
 * ExamEditorPage — Soạn section, câu hỏi, publish một đề thi
 */

import React from "react";
import { useParams } from "react-router-dom";
import { ExamEditorView } from "../features/exam-management";

export const ExamEditorPage: React.FC = () => {
  const { examId = "" } = useParams<{ examId: string }>();
  return <ExamEditorView examId={examId} />;
};

export default ExamEditorPage;
