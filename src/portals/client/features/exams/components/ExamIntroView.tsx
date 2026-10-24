/**
 * ExamIntroView — Trang giới thiệu đề: cấu trúc section, luật thi, quyền làm bài, nút Bắt đầu.
 * Nội dung câu hỏi chỉ hiện trong phòng thi (khi đồng hồ đã chạy).
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Clock, FileQuestion, Play, RotateCcw, Target, Trophy } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Loading } from "@/shared/components/Loading";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/shared/auth";
import { EXAM_TYPE_LABEL } from "@/shared/types";
import { useExamDetail, useStartAttempt } from "../hooks/useExams";
import { ExamStateCard } from "./ExamStateCard";

interface ExamIntroViewProps {
  examId: string;
}

export function ExamIntroView({ examId }: ExamIntroViewProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isError, error, refetch } = useExamDetail(examId);
  const start = useStartAttempt();

  if (isLoading) return <Loading />;
  if (isError || !data) {
    return (
      <ExamStateCard
        tone={error?.status === 404 || error?.status === 400 ? "empty" : "error"}
        title={error?.status === 404 || error?.status === 400 ? "Đề thi không tồn tại" : "Không tải được đề thi"}
        message={error?.message}
        onRetry={error?.status === 404 || error?.status === 400 ? undefined : refetch}
        action={
          <Button leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.EXAMS)}>
            Về ngân hàng đề
          </Button>
        }
      />
    );
  }

  const { exam } = data;
  const canStart = isAuthenticated && data.accessible !== false;

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.EXAMS)}>
        Ngân hàng đề
      </Button>

      <Card className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {exam.certificateName && <Badge variant="ielts">{exam.certificateName}</Badge>}
          {exam.examType && <Badge variant="primary">{EXAM_TYPE_LABEL[exam.examType]}</Badge>}
          {exam.recommendedLevel && <Badge>Level {exam.recommendedLevel}</Badge>}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{exam.examTitle}</h1>
          {exam.description && <p className="text-sm text-slate-600 mt-2">{exam.description}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Clock} label="Thời gian" value={`${exam.durationMinutes} phút`} />
          <Stat icon={FileQuestion} label="Số câu" value={`${exam.totalQuestions} câu`} />
          <Stat icon={Target} label="Điểm đạt" value={`${exam.passingScore ?? 0}%`} />
          <Stat
            icon={RotateCcw}
            label="Số lượt"
            value={exam.maxAttempts && exam.maxAttempts > 0 ? `${exam.maxAttempts} lượt` : "Không giới hạn"}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-extrabold text-slate-900 mb-3">Cấu trúc đề · {data.maxScore} điểm</h2>
        <ol className="space-y-2">
          {data.sections.map((s) => (
            <li key={s.sectionId} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Badge variant="ai" size="sm">{s.sectionType}</Badge>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-800">{s.title}</p>
                {s.instructions && <p className="text-xs text-slate-500">{s.instructions}</p>}
              </div>
              <span className="text-xs text-slate-500">{s.questionCount} câu · {s.maxScore ?? 0} điểm</span>
            </li>
          ))}
          {data.sections.length === 0 && <li className="text-sm text-slate-500">Đề không chia section.</li>}
        </ol>
      </Card>

      <Card className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-sm text-slate-600 space-y-1">
          <p className="flex items-center gap-2 font-bold text-slate-800">
            <Trophy className="w-4 h-4 text-primary" /> Lưu ý khi làm bài
          </p>
          <p>Đồng hồ chạy ngay khi bắt đầu và không dừng khi tải lại trang. Đáp án được lưu tự động; hết giờ hệ thống tự nộp.</p>
          {!isAuthenticated && <p className="text-status-warning font-semibold">Bạn cần đăng nhập để làm bài.</p>}
          {isAuthenticated && data.accessible === false && (
            <p className="text-status-danger font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> {data.accessMessage}
            </p>
          )}
          {start.error && <p className="text-status-danger font-semibold">{start.error.message}</p>}
        </div>
        {isAuthenticated ? (
          <Button size="lg" leftIcon={Play} disabled={!canStart} isLoading={start.isPending} onClick={() => start.mutate(examId)}>
            Bắt đầu làm bài
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
            Đăng nhập
          </Button>
        )}
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="font-extrabold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
