/**
 * MentorDashboardView — Bảng điều khiển tổng quan dành cho Giảng viên / Mentor
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Mic,
  Edit3,
} from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { ROUTES } from "@/shared/constants/routes";
import type { StudentSubmission } from "../types";

const MOCK_PENDING_LIST: StudentSubmission[] = [
  {
    id: "sub-01",
    studentName: "Trần Bảo Nam",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    lessonTitle: "Writing Task 2: Technology in Education",
    type: "WRITING",
    submittedAt: "10 phút trước",
    status: "PENDING",
    aiSuggestedBand: 6.5,
  },
  {
    id: "sub-02",
    studentName: "Lê Hoàng Yến",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    lessonTitle: "Speaking Part 2: Describe a memorable journey",
    type: "SPEAKING",
    submittedAt: "35 phút trước",
    status: "PENDING",
    audioDuration: "02:45",
    aiSuggestedBand: 7.0,
  },
  {
    id: "sub-03",
    studentName: "Phạm Minh Quang",
    courseTitle: "IELTS Foundation 5.0",
    lessonTitle: "Writing Task 1: Bar chart overview",
    type: "WRITING",
    submittedAt: "2 giờ trước",
    status: "IN_REVIEW",
    aiSuggestedBand: 6.0,
  },
];

const UPCOMING_1ON1 = [
  {
    time: "14:00 - 14:45",
    student: "Nguyễn Thu Hà",
    topic: "Luyện phản xạ Speaking Part 3 (Topic: Environment)",
    status: "Sắp diễn ra",
  },
  {
    time: "16:30 - 17:15",
    student: "Đặng Tiến Dũng",
    topic: "Chữa dàn ý và sửa lỗi bài thi thử Writing Task 2",
    status: "Hôm nay",
  },
];

export const MentorDashboardView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="ai" size="sm" icon={Sparkles}>
                Mentor Workspace
              </Badge>
              <span className="text-xs text-purple-200">Học kỳ Fall 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Xin chào, Mentor David! 👋
            </h1>
            <p className="mt-2 text-sm text-purple-200 max-w-xl">
              Hôm nay bạn có{" "}
              <span className="font-bold text-white">3 bài làm mới</span> cần chấm và{" "}
              <span className="font-bold text-white">2 ca kèm 1-1</span> trực tuyến.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              rightIcon={ArrowRight}
              onClick={() => navigate(ROUTES.MENTOR.GRADING)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30"
            >
              Vào hàng chờ chấm bài
            </Button>
          </div>
        </div>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bài chờ chấm
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">3</p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">2 bài trong 24h</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Học viên phụ trách
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">28</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">+4 tuần này</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ca kèm 1-1 hôm nay
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">2</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Tiếp theo lúc 14:00</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đánh giá trung bình
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">4.95 / 5</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">142 lượt phản hồi</p>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Pending Submissions & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pending Submissions Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Hàng chờ chấm bài gần đây
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Các bài tập Writing & Speaking học viên vừa nộp
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.MENTOR.GRADING)}
            >
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_PENDING_LIST.map((sub) => (
              <Card
                key={sub.id}
                hoverable
                className="p-4 transition-all border-slate-200"
                onClick={() => navigate(ROUTES.MENTOR.GRADING)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        sub.type === "WRITING"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {sub.type === "WRITING" ? (
                        <Edit3 className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {sub.studentName}
                        </span>
                        <Badge
                          variant={sub.type === "WRITING" ? "primary" : "ai"}
                          size="sm"
                        >
                          {sub.type}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          • {sub.submittedAt}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium mt-1">
                        {sub.lessonTitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {sub.courseTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {sub.aiSuggestedBand && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ai/10 text-ai text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        AI gợi ý: Band {sub.aiSuggestedBand}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3"
                      >
                        Chấm ngay
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Today Schedule */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Lịch kèm 1-1 hôm nay
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phòng họp trực tuyến bảo mật qua WebRTC
            </p>
          </div>

          <div className="space-y-3">
            {UPCOMING_1ON1.map((item, idx) => (
              <Card key={idx} className="p-4 border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                  <Badge variant="success" size="sm" icon={CheckCircle2}>
                    {item.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{item.student}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {item.topic}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Google Meet / Live</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2.5 text-purple-700 border-purple-200 hover:bg-purple-50"
                  >
                    Vào phòng học
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardView;
