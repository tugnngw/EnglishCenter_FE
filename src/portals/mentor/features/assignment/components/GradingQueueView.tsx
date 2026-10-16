/**
 * GradingQueueView — Hàng chờ chấm bài và Panel chấm điểm chi tiết của Giảng viên
 */

import React, { useState } from "react";
import {
  FileText,
  Mic,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Send,
  Save,
  Check,
  ChevronRight,
  User,
  BookOpen,
} from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import type { StudentSubmission, SubmissionStatus, SubmissionType } from "../types";

const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub-01",
    studentName: "Trần Bảo Nam",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    lessonTitle: "Writing Task 2: Technology in Education",
    type: "WRITING",
    submittedAt: "15 phút trước",
    status: "PENDING",
    essayContent: `In contemporary society, digital technology has revolutionized the educational paradigm in unprecedented ways. While some skeptics argue that screen time detracts from interpersonal cognitive growth, I firmly contend that technological integration enhances pedagogical outcomes and fosters autonomous learning.

To begin with, interactive platforms grant students immediate access to global knowledge repositories. For instance, learners in remote regions can access Harvard lectures and AI-assisted grammar checkers in real time, effectively mitigating educational disparities. Furthermore, multimedia tools cater to diverse learning styles, whether visual or auditory.

In conclusion, although over-reliance on artificial intelligence might weaken critical thinking if unmonitored, the prudent implementation of digital tools is indisputably beneficial for modern educational frameworks.`,
    aiSuggestedBand: 7.0,
    mentorBand: 7.0,
    mentorFeedback: "Bài viết mạch lạc, luận điểm rõ ràng. Cần chú ý thêm sự đa dạng của các cấu trúc câu đảo ngữ (Inversion) để đạt Band 7.5+.",
  },
  {
    id: "sub-02",
    studentName: "Lê Hoàng Yến",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    lessonTitle: "Speaking Part 2: Describe a memorable journey",
    type: "SPEAKING",
    submittedAt: "40 phút trước",
    status: "PENDING",
    audioDuration: "02:45",
    essayContent: "[Audio Transcript]: I would like to talk about a memorable trip I took to Da Lat with my high school classmates two years ago. The atmosphere was breathtakingly serene, surrounded by lush pine forests. We rented motorbikes and rode through winding roads...",
    aiSuggestedBand: 6.5,
    mentorBand: 6.5,
    mentorFeedback: "Phát âm âm đuôi tốt, ngữ điệu tự nhiên. Cần giảm bớt các âm ngập ngừng 'uhm', 'well' ở phần giữa câu.",
  },
  {
    id: "sub-03",
    studentName: "Phạm Minh Quang",
    courseTitle: "IELTS Foundation 5.0",
    lessonTitle: "Writing Task 1: Bar chart overview",
    type: "WRITING",
    submittedAt: "3 giờ trước",
    status: "IN_REVIEW",
    essayContent: "The bar chart illustrates the amount of electricity produced in four countries between 2010 and 2020. Overall, country A produced the highest amount of energy throughout the recorded period...",
    aiSuggestedBand: 5.5,
    mentorBand: 6.0,
    mentorFeedback: "Đã chỉ ra được xu hướng chính (Overall). Tuy nhiên còn thiếu một số số liệu dẫn chứng cụ thể ở các năm.",
  },
  {
    id: "sub-04",
    studentName: "Nguyễn Hải Đăng",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    lessonTitle: "Writing Task 2: Environmental Protection",
    type: "WRITING",
    submittedAt: "1 ngày trước",
    status: "GRADED",
    essayContent: "Protecting the environment is often viewed as the collective responsibility of both national governments and individual citizens...",
    aiSuggestedBand: 7.5,
    mentorBand: 7.5,
    mentorFeedback: "Bài làm rất xuất sắc! Từ vựng chuyên ngành môi trường phong phú (carbon footprint, ecological degradation).",
  },
];

export const GradingQueueView: React.FC = () => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState<string>("sub-01");
  const [statusFilter, setStatusFilter] = useState<"ALL" | SubmissionStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const selectedSubmission = submissions.find((s) => s.id === selectedId) || submissions[0];

  const [currentScore, setCurrentScore] = useState<number>(
    selectedSubmission?.mentorBand || selectedSubmission?.aiSuggestedBand || 7.0
  );
  const [currentFeedback, setCurrentFeedback] = useState<string>(
    selectedSubmission?.mentorFeedback || ""
  );

  const handleSelectSubmission = (sub: StudentSubmission) => {
    setSelectedId(sub.id);
    setCurrentScore(sub.mentorBand || sub.aiSuggestedBand || 7.0);
    setCurrentFeedback(sub.mentorFeedback || "");
  };

  const handleSaveDraft = () => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedId
          ? {
              ...s,
              status: "IN_REVIEW",
              mentorBand: currentScore,
              mentorFeedback: currentFeedback,
            }
          : s
      )
    );
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handlePublishGrade = () => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedId
          ? {
              ...s,
              status: "GRADED",
              mentorBand: currentScore,
              mentorFeedback: currentFeedback,
            }
          : s
      )
    );
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.lessonTitle.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-purple-600" />
            Hàng chờ & Panel Chấm bài
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chấm bài tập IELTS Writing và Speaking với sự trợ giúp của AI Rubric
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(["ALL", "PENDING", "IN_REVIEW", "GRADED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === st
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "ALL" && "Tất cả"}
              {st === "PENDING" && "Chờ chấm"}
              {st === "IN_REVIEW" && "Đang chấm"}
              {st === "GRADED" && "Đã xong"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Queue (35%) / Right Grading Panel (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: List of submissions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên học viên, bài tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredSubmissions.length === 0 ? (
              <Card className="text-center py-10 text-slate-400 text-sm">
                Không tìm thấy bài nộp nào phù hợp.
              </Card>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = sub.id === selectedId;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all text-left ${
                      isSelected
                        ? "bg-purple-50/70 border-purple-300 shadow-sm ring-1 ring-purple-400"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {sub.studentName}
                        </span>
                        <Badge
                          variant={sub.type === "WRITING" ? "primary" : "ai"}
                          size="sm"
                        >
                          {sub.type}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          sub.status === "GRADED"
                            ? "success"
                            : sub.status === "IN_REVIEW"
                            ? "neutral"
                            : "danger"
                        }
                        size="sm"
                      >
                        {sub.status === "GRADED"
                          ? "Đã chấm"
                          : sub.status === "IN_REVIEW"
                          ? "Đang chấm"
                          : "Chờ chấm"}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {sub.lessonTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {sub.courseTitle}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {sub.submittedAt}
                      </span>
                      {sub.aiSuggestedBand && (
                        <span className="font-semibold text-purple-700 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          AI: {sub.aiSuggestedBand}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Interactive Grading Panel */}
        <div className="lg:col-span-7">
          {selectedSubmission ? (
            <Card className="p-6 space-y-6 border-slate-200">
              {/* Submission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">
                      {selectedSubmission.studentName}
                    </span>
                    <Badge
                      variant={selectedSubmission.type === "WRITING" ? "primary" : "ai"}
                      size="sm"
                    >
                      {selectedSubmission.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedSubmission.courseTitle} • {selectedSubmission.lessonTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">
                      AI Band
                    </p>
                    <p className="text-base font-black text-purple-600">
                      {selectedSubmission.aiSuggestedBand}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Submission Content Box */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Nội dung bài làm của học viên
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap font-sans">
                  {selectedSubmission.essayContent}
                </div>
              </div>

              {/* AI Rubric Recommendation Banner */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-bold text-purple-900">
                      AI Rubric Suggestions (IELTS Official Criteria)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <span className="text-slate-500 block text-[10px]">Task Achievement</span>
                        <span className="font-bold text-slate-900">7.0</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <span className="text-slate-500 block text-[10px]">Coherence</span>
                        <span className="font-bold text-slate-900">7.0</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <span className="text-slate-500 block text-[10px]">Lexical Resource</span>
                        <span className="font-bold text-slate-900">7.5</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-100">
                        <span className="text-slate-500 block text-[10px]">Grammar</span>
                        <span className="font-bold text-slate-900">6.5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grading Input Form */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Điểm chính thức của Mentor (Band 0.0 - 9.0)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="9.0"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(parseFloat(e.target.value) || 0)}
                      className="w-28 px-3 py-2 text-base font-extrabold text-purple-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                    <span className="text-xs text-slate-500">
                      Khuyến nghị AI: <span className="font-bold">{selectedSubmission.aiSuggestedBand}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nhận xét & Hướng dẫn sửa lỗi cho học viên
                  </label>
                  <textarea
                    rows={4}
                    value={currentFeedback}
                    onChange={(e) => setCurrentFeedback(e.target.value)}
                    placeholder="Ghi nhận xét chi tiết: điểm mạnh, lỗi sai từ vựng, ngữ pháp, hướng phát triển ý..."
                    className="w-full p-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {isSavedNotice ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã cập nhật bài làm thành công!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    Bản nháp được tự động đồng bộ
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Save}
                    onClick={handleSaveDraft}
                  >
                    Lưu nháp
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Send}
                    onClick={handlePublishGrade}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Duyệt & Gửi kết quả
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16 text-slate-400">
              Chọn một bài nộp ở cột bên trái để bắt đầu chấm.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingQueueView;
