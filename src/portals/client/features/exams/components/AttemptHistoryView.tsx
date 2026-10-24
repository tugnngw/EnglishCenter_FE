/**
 * AttemptHistoryView — Lịch sử thi của học viên (mới nhất trước).
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Loading } from "@/shared/components/Loading";
import { ROUTES } from "@/shared/constants/routes";
import { ATTEMPT_STATUS_LABEL, type AttemptSummary } from "@/shared/types";
import { formatDateTime } from "@/shared/utils";
import { useMyAttempts } from "../hooks/useExams";
import { ExamStateCard } from "./ExamStateCard";

const STATUS_VARIANT = { in_progress: "primary", submitted: "ai", graded: "success", expired: "warning" } as const;

export function AttemptHistoryView() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = useMyAttempts(page);

  const open = (a: AttemptSummary) =>
    navigate(a.status === "in_progress" ? ROUTES.EXAM_ATTEMPT(a.attemptId) : ROUTES.EXAM_RESULT(a.attemptId));

  if (isLoading) return <Loading />;
  if (isError) return <ExamStateCard tone="error" title="Không tải được lịch sử thi" message={error.message} onRetry={refetch} />;
  if (!data || data.data.length === 0) {
    return (
      <ExamStateCard
        tone="empty"
        title="Bạn chưa làm đề nào"
        action={<Button leftIcon={Play} onClick={() => navigate(ROUTES.EXAMS)}>Chọn đề để làm</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900">Lịch sử thi</h1>
      <Card noPadding className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Đề thi</th>
              <th className="px-4 py-3">Lượt</th>
              <th className="px-4 py-3">Bắt đầu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Điểm</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {data.data.map((a) => (
              <tr key={a.attemptId} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-slate-800">{a.examTitle}</td>
                <td className="px-4 py-3">#{a.attemptNumber}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(a.startTime)}</td>
                <td className="px-4 py-3">
                  <Badge size="sm" variant={STATUS_VARIANT[a.status]}>{ATTEMPT_STATUS_LABEL[a.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">
                  {a.score !== undefined ? `${a.score}/${a.maxScore}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant={a.status === "in_progress" ? "primary" : "outline"} onClick={() => open(a)}>
                    {a.status === "in_progress" ? "Làm tiếp" : "Xem kết quả"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" leftIcon={ChevronLeft} disabled={page === 0} onClick={() => setPage(page - 1)}>
            Trước
          </Button>
          <span className="text-sm text-slate-600">Trang {page + 1}/{data.totalPages}</span>
          <Button variant="outline" size="sm" rightIcon={ChevronRight} disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
