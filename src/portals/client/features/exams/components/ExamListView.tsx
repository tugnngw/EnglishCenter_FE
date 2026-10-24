/**
 * ExamListView — Ngân hàng đề thi: lọc theo loại đề, phạm vi, level; phân trang phía server.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, History, Search } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { ROUTES } from "@/shared/constants/routes";
import { useDebounce } from "@/shared/hooks";
import { EXAM_TYPE_LABEL, type ExamScope, type ExamType } from "@/shared/types";
import { useAuthStore } from "@/shared/auth";
import { cn } from "@/shared/utils/cn";
import { useExamList } from "../hooks/useExams";
import { ExamCard } from "./ExamCard";
import { ExamStateCard } from "./ExamStateCard";

const SCOPE_OPTIONS: { value: ExamScope | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "trial", label: "Thi thử chứng chỉ" },
  { value: "course", label: "Đề của khóa học" },
];

export function ExamListView() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [keyword, setKeyword] = useState("");
  const [examType, setExamType] = useState<ExamType | "">("");
  const [examScope, setExamScope] = useState<ExamScope | "">("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(0);
  const debouncedKeyword = useDebounce(keyword, 400);

  const { data, isLoading, isError, error, refetch, isFetching } = useExamList({
    keyword: debouncedKeyword || undefined,
    examType: examType || undefined,
    examScope: examScope || undefined,
    level: level || undefined,
    page,
  });

  const resetPage = () => setPage(0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Khảo thí & Luyện đề</h1>
          <p className="text-sm text-slate-500 mt-1">Chọn đề, làm bài có tính giờ và xem kết quả chấm tự động.</p>
        </div>
        {isAuthenticated && (
          <Button variant="outline" leftIcon={History} onClick={() => navigate(ROUTES.EXAM_HISTORY)}>
            Lịch sử thi của tôi
          </Button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-card p-4 flex flex-col md:flex-row gap-3">
        <label className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              resetPage();
            }}
            placeholder="Tìm theo tên hoặc mã đề…"
            className="w-full h-10 pl-9 pr-3 rounded-input border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
          />
        </label>
        <select
          value={examType}
          onChange={(e) => {
            setExamType(e.target.value as ExamType | "");
            resetPage();
          }}
          className="h-10 px-3 rounded-input border border-slate-200 text-sm bg-white"
          aria-label="Loại đề"
        >
          <option value="">Mọi loại đề</option>
          {(Object.keys(EXAM_TYPE_LABEL) as ExamType[]).map((t) => (
            <option key={t} value={t}>
              {EXAM_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        <input
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            resetPage();
          }}
          placeholder="Level (VD: B1)"
          className="h-10 w-full md:w-32 px-3 rounded-input border border-slate-200 text-sm"
          aria-label="Level"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SCOPE_OPTIONS.map((opt) => (
          <button
            key={opt.value || "all"}
            type="button"
            onClick={() => {
              setExamScope(opt.value);
              resetPage();
            }}
            className={cn(
              "h-8 px-3 rounded-full text-xs font-bold border transition-colors",
              examScope === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ExamStateCard tone="error" title="Không tải được danh sách đề" message={error.message} onRetry={refetch} />
      ) : !data || data.data.length === 0 ? (
        <ExamStateCard tone="empty" title="Chưa có đề phù hợp" message="Thử bỏ bớt bộ lọc hoặc tìm từ khóa khác." />
      ) : (
        <>
          <div className={cn("grid sm:grid-cols-2 xl:grid-cols-3 gap-4", isFetching && "opacity-70")}>
            {data.data.map((exam) => (
              <ExamCard key={exam.examId} exam={exam} onSelect={(id) => navigate(ROUTES.EXAM_DETAIL(id))} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" leftIcon={ChevronLeft} disabled={page === 0} onClick={() => setPage(page - 1)}>
                Trước
              </Button>
              <span className="text-sm text-slate-600">
                Trang {data.currentPage + 1}/{data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                rightIcon={ChevronRight}
                disabled={page + 1 >= data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
