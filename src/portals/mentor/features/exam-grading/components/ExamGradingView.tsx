/**
 * ExamGradingView — Hàng đợi bài thi chờ chấm Writing/Speaking (cũ nhất trước) + panel chấm bài.
 * Admin thấy mọi đề; mentor chỉ thấy đề thuộc khóa học mình phụ trách (backend lọc).
 */

import React, { useState } from "react";
import { ClipboardCheck, Inbox, RotateCcw } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Loading } from "@/shared/components/Loading";
import { ATTEMPT_STATUS_LABEL } from "@/shared/types";
import { formatDateTime } from "@/shared/utils";
import { cn } from "@/shared/utils/cn";
import { useAttemptForGrading, usePendingAttempts } from "../hooks/useExamGrading";
import { EssayGradeForm } from "./EssayGradeForm";

export function ExamGradingView() {
  const [page] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queue = usePendingAttempts(page);
  const detail = useAttemptForGrading(selectedId);
  const essays = (detail.data?.answers ?? []).filter((a) => a.questionType === "essay");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Chấm bài thi Writing / Speaking</h1>
        <p className="text-sm text-slate-500 mt-1">Phần trắc nghiệm đã được chấm tự động; chỉ còn các câu tự luận chờ bạn.</p>
      </div>

      <div className="grid lg:grid-cols-[360px,1fr] gap-5 items-start">
        <Card noPadding>
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800">Hàng đợi ({queue.data?.totalElements ?? 0})</span>
            <Button size="sm" variant="ghost" leftIcon={RotateCcw} onClick={() => queue.refetch()}>
              Làm mới
            </Button>
          </div>
          {queue.isLoading ? (
            <Loading />
          ) : queue.isError ? (
            <p className="p-4 text-sm text-status-danger">{queue.error.message}</p>
          ) : (queue.data?.data.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" /> Không còn bài nào chờ chấm.
            </div>
          ) : (
            <ul>
              {queue.data?.data.map((a) => (
                <li key={a.attemptId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(a.attemptId)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50",
                      selectedId === a.attemptId && "bg-primary-tint",
                    )}
                  >
                    <p className="font-bold text-sm text-slate-800">{a.studentName ?? a.studentEmail}</p>
                    <p className="text-xs text-slate-500 truncate">{a.examTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Nộp {a.endTime ? formatDateTime(a.endTime) : "—"} · {ATTEMPT_STATUS_LABEL[a.status]}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="space-y-4">
          {!selectedId ? (
            <div className="py-16 text-center text-sm text-slate-500">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" /> Chọn một bài trong hàng đợi để chấm.
            </div>
          ) : detail.isLoading ? (
            <Loading />
          ) : detail.isError || !detail.data ? (
            <p className="text-sm text-status-danger">{detail.error?.message ?? "Không tải được bài làm"}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-slate-900">{detail.data.attempt.studentName}</h2>
                <Badge variant="primary">{detail.data.attempt.examTitle}</Badge>
                <Badge variant={detail.data.attempt.status === "graded" ? "success" : "warning"}>
                  {ATTEMPT_STATUS_LABEL[detail.data.attempt.status]}
                </Badge>
                <span className="ml-auto text-sm font-bold text-slate-700">
                  Tổng hiện tại: {detail.data.attempt.score}/{detail.data.attempt.maxScore}
                </span>
              </div>
              {essays.length === 0 && <p className="text-sm text-slate-500">Bài này không có câu tự luận.</p>}
              {essays.map((answer) => (
                <EssayGradeForm key={`${selectedId}-${answer.questionId}`} attemptId={selectedId} answer={answer} />
              ))}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
