/**
 * CourseDetailView — Gold Flow #2
 * -----------------------------------------------------------
 * Màn hình chi tiết khóa học với:
 *   - Cột chính (70%): Header + Tab Chương trình học / Từ vựng trọng tâm
 *   - Cột phụ (30% Sticky Card): Ảnh + Giá + CTA Đăng ký + Làm placement test
 *
 * Tương tác:
 *   - Click "Đăng ký khóa học ngay" → mở PaymentCheckoutModal
 *   - Click "Làm bài thi thử đầu vào" → navigate /exams/ielts-mock-01
 *   - Sau khi thanh toán thành công, CTA đổi sang "Vào học ngay"
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  Clock,
  Award,
  PlayCircle,
  Lock,
  CheckCircle2,
  ChevronDown,
  FileText,
  Sparkles,
  ShoppingCart,
  Zap,
  GraduationCap,
  Volume2,
  Quote,
  Check,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import type { Course, CourseSection, Lesson } from './courseTypes';
import { formatVND } from '@/utils/format';
import { useEnrollmentStore } from '@/stores';
import { PayOSCheckoutModal } from '@/features/payments';

type Tab = 'curriculum' | 'vocabulary';

export interface CourseDetailViewProps {
  course: Course;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course }) => {
  const navigate = useNavigate();
  const isEnrolled = useEnrollmentStore((s) => isEnrolledSelector(s, course.id));
  const subscribe = useEnrollmentStore((s) => s.subscribe);
  const [isEnrolledLocal, setIsEnrolledLocal] = useState(isEnrolled);
  const [tab, setTab] = useState<Tab>('curriculum');
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Subscribe tới enrollment store để update real-time khi thanh toán xong
  useEffect(() => {
    const unsub = subscribe((courseId) => {
      if (courseId === course.id) setIsEnrolledLocal(true);
    });
    return unsub;
  }, [course.id, subscribe]);

  // Đồng bộ với store ban đầu
  useEffect(() => {
    setIsEnrolledLocal(isEnrolled);
  }, [isEnrolled]);

  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      {/* =============== CỘT CHÍNH (70%) =============== */}
      <div className="space-y-6 min-w-0">
        {/* Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-ai/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={course.certificate.toLowerCase() as 'ielts' | 'toeic' | 'vstep'} size="md">
                {course.certificate}
              </Badge>
              <Badge variant="ai" size="md" icon={Sparkles}>
                AI-Powered
              </Badge>
              <Badge variant="warning" size="md" icon={Zap}>
                Giảm {discount}%
              </Badge>
              {isEnrolledLocal && (
                <Badge variant="success" size="md" icon={Check}>
                  Đã ghi danh
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              {course.subtitle}
            </p>

            {/* Rating + meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">
                  ({course.ratingCount.toLocaleString('vi-VN')} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">
                  {course.studentEnrolled.toLocaleString('vi-VN')}
                </span>
                <span className="text-slate-500">học viên</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{course.durationHours}</span>
                <span className="text-slate-500">giờ học</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{course.totalLessons}</span>
                <span className="text-slate-500">bài học</span>
              </div>
            </div>

            {/* Mục tiêu đầu ra */}
            <Card className="bg-gradient-to-br from-primary-tint to-white" noPadding>
              <div className="p-5 space-y-3">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Mục tiêu đầu ra
                </p>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {course.targetDescription}
                </p>
                <ul className="space-y-1.5">
                  {course.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Card>

        {/* Mentor card */}
        <Card>
          <div className="flex items-center gap-4">
            <img
              src={course.mentor.avatarUrl}
              alt={course.mentor.fullName}
              className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900">
                  Mentor {course.mentor.fullName}
                </h3>
                <Badge variant="ai" size="sm">
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-ai font-semibold mt-0.5">
                {course.mentor.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {course.mentor.experience} · {course.mentor.studentCount.toLocaleString('vi-VN')}{' '}
                học viên
              </p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 text-sm">
                  {course.mentor.rating}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                Rating
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card noPadding>
          <div className="flex border-b border-slate-200 px-2">
            {[
              { key: 'curriculum' as const, label: 'Chương trình học', icon: FileText },
              {
                key: 'vocabulary' as const,
                label: 'Từ vựng trọng tâm',
                icon: GraduationCap,
              },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-4 text-sm font-bold transition-all relative',
                    active
                      ? 'text-primary'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-t" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {tab === 'curriculum' ? (
              <CurriculumList sections={course.curriculum} />
            ) : (
              <VocabularyGrid cards={course.vocabularyBank} />
            )}
          </div>
        </Card>
      </div>

      {/* =============== CỘT PHỤ (30% Sticky Card) =============== */}
      <aside className="lg:sticky lg:top-[120px] self-start space-y-4 h-fit">
        <Card className="overflow-hidden" noPadding>
          {/* Cover image 16:9 */}
          <div className="relative aspect-video bg-slate-100">
            <img
              src={course.coverUrl}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Xem video giới thiệu"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <PlayCircle className="w-8 h-8 text-primary" />
              </div>
            </button>
            <Badge
              variant={course.certificate.toLowerCase() as 'ielts' | 'toeic' | 'vstep'}
              size="sm"
              className="absolute top-3 left-3"
            >
              {course.certificate}
            </Badge>
          </div>

          <div className="p-5 space-y-4">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-extrabold text-slate-900">
                  {formatVND(course.price)}
                </p>
                <p className="text-sm text-slate-400 line-through">
                  {formatVND(course.originalPrice)}
                </p>
              </div>
              <p className="text-xs text-status-danger font-semibold mt-1">
                Tiết kiệm {formatVND(course.originalPrice - course.price)} (
                {discount}%)
              </p>
            </div>

            {/* CTA chính */}
            {isEnrolledLocal ? (
              <Button
                variant="success"
                size="lg"
                fullWidth
                leftIcon={Check}
                rightIcon={ArrowRight}
                onClick={() => navigate('/my-learning')}
              >
                Đã ghi danh - Vào học ngay
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={ShoppingCart}
                onClick={() => setPaymentOpen(true)}
              >
                Đăng ký khóa học ngay
              </Button>
            )}

            {/* CTA phụ — placement test */}
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={Zap}
              onClick={() => navigate('/exams/ielts-mock-01')}
            >
              Làm bài thi thử đầu vào (Placement Test)
            </Button>

            {/* Course highlights */}
            <ul className="space-y-2.5 pt-2 border-t border-slate-100">
              {[
                { icon: Clock, text: `${course.durationHours} giờ học` },
                { icon: FileText, text: `${course.totalLessons} bài học` },
                { icon: Trophy, text: 'AI chấm Speaking/Writing 24/7' },
                { icon: Award, text: 'Chứng chỉ hoàn thành' },
              ].map((h) => {
                const Icon = h.icon;
                return (
                  <li
                    key={h.text}
                    className="flex items-center gap-2.5 text-sm text-slate-600"
                  >
                    <div className="w-7 h-7 rounded-md bg-primary-tint flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {h.text}
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>

        {/* Support card */}
        <Card className="bg-gradient-to-br from-ai/5 to-primary-tint">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-input bg-ai-gradient flex items-center justify-center shadow-ai-glow shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-900">Cần tư vấn?</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Hotline 1900-6868 · Tư vấn miễn phí
              </p>
            </div>
          </div>
        </Card>
      </aside>

      {/* =============== MODAL PAYMENT (PayOS) =============== */}
      <PayOSCheckoutModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        course={course}
        onSuccess={() => {
          // enrollmentStore đã được cập nhật bên trong modal;
          // listener ở useEffect trên sẽ tự đổi CTA sang "Đã ghi danh"
        }}
      />
    </div>
  );
};

/* =================== Sub-components =================== */

const CurriculumList: React.FC<{ sections: CourseSection[] }> = ({ sections }) => {
  return (
    <div className="space-y-3">
      {sections.map((sec, idx) => (
        <CurriculumSection
          key={sec.id}
          section={sec}
          defaultOpen={idx === 0}
        />
      ))}
    </div>
  );
};

const CurriculumSection: React.FC<{
  section: CourseSection;
  defaultOpen: boolean;
}> = ({ section, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const totalMin = section.lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
  return (
    <div className="rounded-input border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50/60 hover:bg-slate-100/80 transition-colors text-left"
      >
        <span className="w-7 h-7 rounded-md bg-primary-tint text-primary text-xs font-extrabold flex items-center justify-center shrink-0">
          {section.order}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-900">{section.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {section.lessons.length} bài · {Math.round(totalMin / 60)} giờ{' '}
            {totalMin % 60} phút
          </p>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform',
            open && 'rotate-180 text-slate-700',
          )}
        />
      </button>
      {open && (
        <ul className="divide-y divide-slate-100">
          {section.lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      )}
    </div>
  );
};

const LessonItem: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const isLocked = lesson.status === 'LOCKED';
  const isPreview = lesson.status === 'PREVIEW';
  return (
    <li className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/50 transition-colors">
      <div
        className={cn(
          'w-8 h-8 rounded-md flex items-center justify-center shrink-0',
          isLocked
            ? 'bg-slate-100 text-slate-400'
            : isPreview
              ? 'bg-ai/10 text-ai'
              : 'bg-primary/10 text-primary',
        )}
      >
        {isLocked ? (
          <Lock className="w-3.5 h-3.5" />
        ) : (
          <PlayCircle className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-semibold text-sm truncate',
            isLocked ? 'text-slate-500' : 'text-slate-800',
          )}
        >
          {lesson.title}
        </p>
        {lesson.description && (
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {lesson.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isPreview && (
          <Badge variant="ai" size="sm">
            Preview
          </Badge>
        )}
        {lesson.type === 'LIVE' && (
          <Badge variant="warning" size="sm">
            Live
          </Badge>
        )}
        <span className="text-xs text-slate-500 font-mono">
          {lesson.durationMinutes} phút
        </span>
      </div>
    </li>
  );
};

const VocabularyGrid: React.FC<{
  cards: { id: string; word: string; ipa: string; partOfSpeech: string; meaning: string; example: string; exampleTranslation: string }[];
}> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-input border border-slate-200 bg-gradient-to-br from-white to-primary-tint/30 p-4 hover:border-primary/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 group-hover:text-primary transition-colors">
                {card.word}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-mono">{card.ipa}</span>
                <span className="text-[10px] text-slate-400 italic">
                  {card.partOfSpeech}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-md text-slate-400 hover:text-ai hover:bg-ai/10 transition-colors"
              aria-label={`Phát âm ${card.word}`}
              title="Phát âm"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-700 mb-3">
            <span className="text-slate-400 text-xs font-normal mr-1">Nghĩa:</span>
            {card.meaning}
          </p>

          <div className="relative pl-3 border-l-2 border-ai/40 bg-white/60 rounded-r-md py-2 pr-2">
            <Quote className="w-3 h-3 text-ai absolute -left-1.5 -top-1 bg-white rounded-full" />
            <p className="text-xs text-slate-700 italic leading-relaxed">
              {card.example}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {card.exampleTranslation}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* Selector riêng — dùng useMemo để không trả về object mới mỗi render */
function isEnrolledSelector(
  s: { enrolled: Record<string, unknown> },
  courseId: string,
): boolean {
  return Boolean(s.enrolled[courseId]);
}

export default CourseDetailView;
