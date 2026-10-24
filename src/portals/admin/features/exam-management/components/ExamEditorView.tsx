/**
 * ExamEditorView — Soạn đề: section, câu hỏi (kèm đáp án đúng), publish / unpublish / xóa.
 * Chỉ sửa được cấu trúc khi đề là nháp và chưa có lượt thi (backend chặn với mã 5005 / 5006).
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, EyeOff, Plus, Rocket, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Loading } from "@/shared/components/Loading";
import { ROUTES } from "@/shared/constants/routes";
import { EXAM_STATUS_LABEL, EXAM_TYPE_LABEL } from "@/shared/types";
import { useAdminExam, useExamActions } from "../hooks/useExamManagement";
import { AddQuestionModal } from "./AddQuestionModal";
import { AddSectionForm } from "./AddSectionForm";
import { QuestionRow } from "./QuestionRow";

interface ExamEditorViewProps {
  examId: string;
}

export function ExamEditorView({ examId }: ExamEditorViewProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useAdminExam(examId);
  const actions = useExamActions(examId);
  const [questionTarget, setQuestionTarget] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (isError || !data) {
    return (
      <Card className="text-center space-y-3">
        <p className="text-sm text-status-danger">{error?.message ?? "Không tải được đề"}</p>
        <Button variant="outline" onClick={() => refetch()}>Thử lại</Button>
      </Card>
    );
  }

  const { exam } = data;
  const isDraft = exam.status === "draft";
  const actionError =
    actions.publish.error ?? actions.unpublish.error ?? actions.remove.error ?? actions.removeSection.error ?? actions.removeQuestion.error;

  const handleDelete = () => {
    if (!window.confirm(`Xóa đề "${exam.examTitle}"?`)) return;
    actions.remove.mutate(undefined, { onSuccess: () => navigate(ROUTES.ADMIN.EXAMS) });
  };

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.ADMIN.EXAMS)}>
        Danh sách đề
      </Button>

      <Card className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">{exam.examTitle}</h1>
            <Badge variant={isDraft ? "neutral" : "success"}>{EXAM_STATUS_LABEL[exam.status]}</Badge>
          </div>
          <p className="text-sm text-slate-500">
            {exam.examCode ?? "Không mã"} · {exam.examType ? EXAM_TYPE_LABEL[exam.examType] : "—"} · {exam.durationMinutes} phút ·{" "}
            {exam.totalQuestions} câu · {data.maxScore} điểm · {exam.totalAttempts ?? 0} lượt thi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isDraft ? (
            <Button leftIcon={Rocket} variant="success" isLoading={actions.publish.isPending} onClick={() => actions.publish.mutate()}>
              Publish
            </Button>
          ) : (
            <Button leftIcon={EyeOff} variant="outline" isLoading={actions.unpublish.isPending} onClick={() => actions.unpublish.mutate()}>
              Unpublish
            </Button>
          )}
          <Button leftIcon={Trash2} variant="danger" isLoading={actions.remove.isPending} onClick={handleDelete}>
            Xóa đề
          </Button>
        </div>
      </Card>

      {actionError && <p className="text-sm text-status-danger font-semibold">{actionError.message}</p>}
      {!isDraft && (
        <p className="text-sm text-status-warning font-semibold">
          Đề đang công khai: hãy Unpublish để sửa section / câu hỏi (đề đã có lượt thi thì không sửa cấu trúc được).
        </p>
      )}

      {data.sections.map((section) => (
        <Card key={section.sectionId} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="ai" size="sm">{section.sectionType}</Badge>
            <h2 className="font-extrabold text-slate-900 flex-1">{section.title}</h2>
            <span className="text-xs text-slate-500">{section.questionCount} câu · {section.maxScore ?? 0} điểm</span>
            <Button size="sm" variant="secondary" leftIcon={Plus} disabled={!isDraft} onClick={() => setQuestionTarget(section.sectionId)}>
              Câu hỏi
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={!isDraft}
              aria-label="Xóa section"
              onClick={() => window.confirm(`Xóa section "${section.title}" và các câu của nó?`) && actions.removeSection.mutate(section.sectionId)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {section.passageText && <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 whitespace-pre-line line-clamp-4">{section.passageText}</p>}
          {(section.questions ?? []).map((q) => (
            <QuestionRow key={q.questionId} question={q} isEditable={isDraft} onRemove={() => actions.removeQuestion.mutate(q.questionId)} />
          ))}
        </Card>
      ))}

      {(data.unsectionedQuestions ?? []).length > 0 && (
        <Card className="space-y-3">
          <h2 className="font-extrabold text-slate-900">Câu hỏi không thuộc section</h2>
          {(data.unsectionedQuestions ?? []).map((q) => (
            <QuestionRow key={q.questionId} question={q} isEditable={isDraft} onRemove={() => actions.removeQuestion.mutate(q.questionId)} />
          ))}
        </Card>
      )}

      {isDraft && (
        <div className="grid lg:grid-cols-2 gap-4">
          <AddSectionForm
            isSubmitting={actions.addSection.isPending}
            serverError={actions.addSection.error?.message}
            onSubmit={(payload, reset) => actions.addSection.mutate(payload, { onSuccess: reset })}
          />
          <Card className="flex flex-col items-center justify-center text-center gap-3">
            <p className="text-sm text-slate-500">Thêm câu hỏi không gắn section, hoặc dùng nút “Câu hỏi” ở từng section.</p>
            <Button leftIcon={Plus} onClick={() => setQuestionTarget("")}>Thêm câu hỏi</Button>
          </Card>
        </div>
      )}

      {questionTarget !== null && (
        <AddQuestionModal
          isOpen
          sections={data.sections}
          defaultSectionId={questionTarget || undefined}
          isSubmitting={actions.addQuestion.isPending}
          serverError={actions.addQuestion.error?.message}
          onClose={() => {
            actions.addQuestion.reset();
            setQuestionTarget(null);
          }}
          onSubmit={(payload) => actions.addQuestion.mutate(payload, { onSuccess: () => setQuestionTarget(null) })}
        />
      )}
    </div>
  );
}
