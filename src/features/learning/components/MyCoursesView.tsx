/**
 * MyCoursesView — Màn hình "Khóa học của tôi"
 * -----------------------------------------------------------
 * Hiển thị:
 *   - Tiêu đề + mô tả ngắn
 *   - 3 thẻ thống kê nhanh (đang học, thời lượng đã học, bài tập cần nộp)
 *   - Bộ lọc "Tất cả / Đang học / Đã hoàn thành"
 *   - Danh sách thẻ khóa học dạng grid (ảnh 16:9, badge chứng chỉ,
 *     tên khóa, mentor, thanh tiến độ, bài kế tiếp, nút Tiếp tục học)
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  AlertCircle,
  Filter,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  PlayCircle,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import {
  MOCK_ENROLLED_COURSES,
  MOCK_LEARNING_STATS,
} from '@/mocks';
import { CERT_LABEL } from '@/interfaces/learning.types';
import type {
  EnrolledCourse,
  MyCoursesFilter,
} from '@/interfaces/learning.types';
import type { CertificateType } from '@/interfaces/course.types';

const CERT_BADGE: Record<CertificateType, 'ielts' | 'toeic' | 'vstep'> = {
  IELTS: 'ielts',
  TOEIC: 'toeic',
  VSTEP: 'vstep',
};

/* ============================================================
 *  Component chính
 * ============================================================ */
export const MyCoursesView: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MyCoursesFilter>('all');

  const filtered = useMemo<EnrolledCourse[]>(() => {
    if (filter === 'all') return MOCK_ENROLLED_COURSES;
    if (filter === 'in-progress') {
      return MOCK_ENROLLED_COURSES.filter(
        (c) => c.progress.status === 'IN_PROGRESS',
      );
    }
    return MOCK_ENROLLED_COURSES.filter(
      (c) => c.progress.status === 'COMPLETED',
    );
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* ============== HEADER ============== */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
            <GraduationCap className="w-3.5 h-3.5" />
            Phòng học của học viên
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Khóa học của tôi
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
            Theo dõi tiến độ học tập và tiếp tục các bài giảng đang diễn ra.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          leftIcon={Trophy}
          onClick={() => navigate('/exams/ielts-mock-01')}
        >
          Luyện đề thi cuối kỳ
        </Button>
      </header>

      {/* ============== STATS ============== */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        aria-label="Thống kê học tập"
      >
        <StatCard
          icon={BookOpen}
          iconTone="primary"
          label="Khóa học đang học"
          value={MOCK_LEARNING_STATS.inProgressCourses}
          unit="khóa học"
          accentHint="Hãy duy trì đều đặn mỗi ngày"
        />
        <StatCard
          icon={Clock}
          iconTone="ai"
          label="Thời lượng đã học"
          value={MOCK_LEARNING_STATS.studiedHours}
          unit="giờ"
          accentHint="Tương đương 4 tuần luyện tập"
        />
        <StatCard
          icon={AlertCircle}
          iconTone="warning"
          label="Bài tập cần hoàn thành"
          value={MOCK_LEARNING_STATS.pendingHomeworks}
          unit="bài tập"
          accentHint="Có bài đang chờ nộp trước 23:59 CN"
          warning
        />
      </section>

      {/* ============== FILTER BAR ============== */}
      <section
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        aria-label="Bộ lọc khóa học"
      >
        <div className="inline-flex items-center gap-1.5 p-1 rounded-input bg-slate-100 border border-slate-200/70 self-start sm:self-auto">
          <FilterButton
            active={filter === 'all'}
            label="Tất cả khóa học"
            onClick={() => setFilter('all')}
            count={MOCK_ENROLLED_COURSES.length}
          />
          <FilterButton
            active={filter === 'in-progress'}
            label="Đang học"
            onClick={() => setFilter('in-progress')}
            count={
              MOCK_ENROLLED_COURSES.filter(
                (c) => c.progress.status === 'IN_PROGRESS',
              ).length
            }
          />
          <FilterButton
            active={filter === 'completed'}
            label="Đã hoàn thành"
            onClick={() => setFilter('completed')}
            count={
              MOCK_ENROLLED_COURSES.filter(
                (c) => c.progress.status === 'COMPLETED',
              ).length
            }
          />
        </div>
        <p className="text-xs text-slate-500">
          Hiển thị{' '}
          <span className="font-bold text-slate-700">{filtered.length}</span> /
          {MOCK_ENROLLED_COURSES.length} khóa học
        </p>
      </section>

      {/* ============== COURSE GRID ============== */}
      {filtered.length === 0 ? (
        <EmptyState
          onReset={() => setFilter('all')}
          isCompletedFilter={filter === 'completed'}
        />
      ) : (
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          aria-label="Danh sách khóa học"
        >
          {filtered.map((ec) => (
            <CourseCard
              key={ec.course.id}
              enrolled={ec}
              onContinue={() =>
                navigate(
                  `/study/${ec.course.slug}?lesson=${ec.nextLesson.id}`,
                )
              }
            />
          ))}
        </section>
      )}
    </div>
  );
};

/* ============================================================
 *  Sub components
 * ============================================================ */
interface StatCardProps {
  icon: React.ElementType;
  iconTone: 'primary' | 'ai' | 'warning';
  label: string;
  value: number;
  unit: string;
  accentHint: string;
  warning?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconTone,
  label,
  value,
  unit,
  accentHint,
  warning = false,
}) => {
  const toneClass: Record<typeof iconTone, string> = {
    primary: 'bg-primary-tint text-primary',
    ai: 'bg-ai/10 text-ai',
    warning: 'bg-status-warning-bg text-status-warning',
  };
  return (
    <Card className="relative overflow-hidden" noPadding>
      <div className="p-5 flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-input flex items-center justify-center shrink-0',
            toneClass[iconTone],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {value}
            </span>
            <span className="text-sm font-semibold text-slate-500">{unit}</span>
            {warning && (
              <Badge variant="warning" size="sm" className="ml-1">
                Cảnh báo
              </Badge>
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">
            {accentHint}
          </p>
        </div>
      </div>
    </Card>
  );
};

interface FilterButtonProps {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}
const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  label,
  count,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-bold transition-all',
      active
        ? 'bg-white text-primary shadow-sm'
        : 'text-slate-600 hover:text-slate-900',
    )}
  >
    {label}
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded text-[10px] font-extrabold',
        active ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500',
      )}
    >
      {count}
    </span>
  </button>
);

interface CourseCardProps {
  enrolled: EnrolledCourse;
  onContinue: () => void;
}
const CourseCard: React.FC<CourseCardProps> = ({ enrolled, onContinue }) => {
  const { course, progress, nextLesson, mentor } = enrolled;
  const isCompleted = progress.status === 'COMPLETED';

  return (
    <Card className="overflow-hidden flex flex-col p-0" hoverable>
      {/* Cover 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
        <img
          src={course.coverUrl}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <Badge variant={CERT_BADGE[course.certificate]} size="md">
            {course.certificate}
          </Badge>
          {isCompleted && (
            <Badge variant="success" size="md" icon={CheckCircle2}>
              Hoàn thành
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
            {CERT_LABEL[course.certificate]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 leading-snug line-clamp-2">
            {course.title}
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <img
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              className="w-7 h-7 rounded-full bg-slate-100 border border-white shadow-sm"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold text-slate-800 truncate">
                {mentor.fullName}
              </p>
              <p className="text-[10px] text-ai font-semibold truncate">
                {mentor.title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-600 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Đã hoàn thành
            </span>
            <span className="font-extrabold text-primary tabular-nums">
              {progress.percent}%
            </span>
          </div>
          <div
            className="h-2 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Next lesson */}
        <div className="rounded-input bg-slate-50 border border-slate-200/70 p-3 flex items-start gap-2.5">
          <PlayCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Bài tiếp theo
            </p>
            <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-2">
              Bài {String(nextLesson.order).padStart(2, '0')} — {nextLesson.title}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          rightIcon={ChevronRight}
          onClick={onContinue}
          className="mt-auto"
        >
          {isCompleted ? 'Xem lại khóa học' : 'Tiếp tục học ngay'}
        </Button>
      </div>
    </Card>
  );
};

interface EmptyStateProps {
  isCompletedFilter: boolean;
  onReset: () => void;
}
const EmptyState: React.FC<EmptyStateProps> = ({
  isCompletedFilter,
  onReset,
}) => (
  <Card className="text-center py-16">
    <div className="w-16 h-16 rounded-card bg-slate-100 flex items-center justify-center mx-auto mb-4">
      <BookOpen className="w-7 h-7 text-slate-400" />
    </div>
    <h3 className="text-lg font-extrabold text-slate-900">
      {isCompletedFilter
        ? 'Bạn chưa hoàn thành khóa học nào'
        : 'Chưa có khóa học nào trong mục này'}
    </h3>
    <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
      Hãy khám phá thêm các khóa luyện thi IELTS, TOEIC, VSTEP và bắt đầu
      hành trình chinh phục chứng chỉ của bạn.
    </p>
    <Button
      variant="outline"
      size="md"
      className="mt-5"
      onClick={onReset}
    >
      Xem tất cả khóa học
    </Button>
  </Card>
);

export default MyCoursesView;
