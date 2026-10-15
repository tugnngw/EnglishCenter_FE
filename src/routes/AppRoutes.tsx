/**
 * AppRoutes — Định tuyến cho Gold Flow
 * -----------------------------------------------------------
 * Bao gồm 4 màn hình liên hoàn:
 *   /login                            → LoginPage  (full-bleed, không AppLayout)
 *   /                                 → Redirect tới /courses/ielts-intensive-mastery
 *   /courses/:id                      → CourseDetailPage (trong AppLayout)
 *   /exams/:id                        → ExamRoomPage     (trong AppLayout)
 *   /register                         → RegisterPage     (full-bleed)
 *   /admin, /schedule, /my-learning   → Placeholder AppLayout pages
 */

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CourseDetailPage from '@/pages/courses/CourseDetailPage';
import ExamRoomPage from '@/pages/exams/ExamRoomPage';
import MyCoursesPage from '@/pages/student/MyCoursesPage';
import StudyRoomPage from '@/pages/student/StudyRoomPage';
import SchedulePage from '@/pages/student/SchedulePage';
import LearningPathPage from '@/pages/student/LearningPathPage';
import { BookOpen, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/features/auth';

const DEFAULT_COURSE = 'ielts-intensive-mastery';

interface PlaceholderProps {
  title: string;
  description: string;
  emoji: string;
  ownerDev: string;
  status?: 'wip' | 'planned';
  features?: string[];
}

const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  description,
  emoji,
  ownerDev,
  status = 'wip',
  features = [],
}) => {
  const role = useAuthStore((s) => s.role);
  return (
    <div className="space-y-6">
      <Card hoverable className="relative overflow-hidden">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-ai/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-card bg-ai-gradient flex items-center justify-center text-4xl shadow-ai-glow shrink-0"
            aria-hidden="true"
          >
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
              <Badge
                variant={status === 'wip' ? 'ai' : 'neutral'}
                size="sm"
                icon={status === 'wip' ? Wrench : Sparkles}
              >
                {status === 'wip' ? 'Đang phát triển' : 'Kế hoạch'}
              </Badge>
              <Badge variant="primary" size="sm">
                Viewer: {role}
              </Badge>
            </div>
            <p className="mt-2 text-slate-600 max-w-2xl">{description}</p>
            <p className="mt-3 text-xs text-slate-400 font-medium">
              Chủ trì: <span className="text-slate-700 font-bold">{ownerDev}</span>
            </p>
          </div>
        </div>
      </Card>

      {features.length > 0 && (
        <Card>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Tính năng sẽ triển khai
          </h2>
          <ul className="mt-4 space-y-2.5">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-input bg-slate-50 border border-slate-200/70"
              >
                <span className="w-6 h-6 rounded-md bg-primary-tint text-primary text-xs font-extrabold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700">{f}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-primary-tint via-white to-ai/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">
              Đang ở chế độ Evaluation Mode
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Sử dụng thanh Role Switcher trên cùng để chuyển đổi góc nhìn
              GUEST / STUDENT / MENTOR / ADMIN và quan sát menu thay đổi theo
              thời gian thực.
            </p>
          </div>
          <Button
            variant="ai"
            size="md"
            rightIcon={ArrowRight}
            onClick={() =>
              (window.location.href = `/courses/${DEFAULT_COURSE}`)
            }
          >
            Vào Gold Flow
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth — full-bleed */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Workspace pages (trong AppLayout) */}
      <Route element={<AppLayout />}>
        {/* Default → mở thẳng Gold Flow course */}
        <Route path="/" element={<Navigate to={`/courses/${DEFAULT_COURSE}`} replace />} />

        {/* Gold Flow #2: Course Detail */}
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Gold Flow #4: Exam Room */}
        <Route path="/exams/:id" element={<ExamRoomPage />} />

        {/* Study Room — phòng học trực tuyến */}
        <Route path="/study/:slug" element={<StudyRoomPage />} />
        <Route path="/study/:slug/:lessonId" element={<StudyRoomPage />} />

        {/* Lịch học & đặt hẹn 1-1 */}
        <Route path="/schedule" element={<SchedulePage />} />

        {/* Lộ trình mục tiêu & luyện viết AI */}
        <Route path="/learning-path" element={<LearningPathPage />} />

        {/* Aliases */}
        <Route path="/my-courses" element={<MyCoursesPage />} />

        {/* Stubs cho các domain khác */}
        <Route
          path="/my-learning"
          element={<MyCoursesPage />}
        />
        <Route
          path="/admin"
          element={
            <Placeholder
              emoji="🛡️"
              title="Quản trị & Phân quyền"
              description="Quản lý người dùng, khóa học, mentor, đơn hàng và các tham số hệ thống."
              ownerDev="Dev 6 — Admin Console"
              features={[
                'CRUD người dùng (Student / Mentor / Admin) + phân quyền',
                'Báo cáo doanh thu, lượt đăng ký, retention',
                'Audit log & cấu hình hệ thống',
              ]}
            />
          }
        />
        <Route
          path="/mentor/grading"
          element={
            <Placeholder
              emoji="✍️"
              title="Chấm bài & Feedback"
              description="Hàng chờ chấm Speaking/Writing của học viên và panel nhận xét chi tiết."
              ownerDev="Dev 5 — Mentor Workspace"
              features={[
                'Bảng kanban: Pending / In Review / Completed',
                'Audio player + transcript cho bài Speaking',
                'AI đề xuất rubric, Mentor tinh chỉnh trước khi gửi',
              ]}
            />
          }
        />
      </Route>

      {/* 404 → về course flagship */}
      <Route path="*" element={<Navigate to={`/courses/${DEFAULT_COURSE}`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
