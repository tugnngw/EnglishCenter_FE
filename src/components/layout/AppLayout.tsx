/**
 * AppLayout — Master Layout dùng chung cho toàn bộ dự án PrepMaster AI
 * -----------------------------------------------------------
 * Cấu trúc:
 *   1. Role Switcher Bar (sticky top-0, Dark Navy #0F172A)
 *   2. Khu vực làm việc (flex): Sidebar (Dark Navy) + Main (Canvas)
 *       2a. Sidebar: collapsible navigation (file Sidebar.tsx)
 *       2b. Main wrapper:
 *           - Topbar (Header.tsx): search, cert pills, bell
 *           - Main Content: bg-canvas, padding, <Outlet />
 *           - Footer: copyright + quick links
 *
 * Role Switcher kết nối trực tiếp với `useAuthStore.setRole()` để chuyển
 * góc nhìn vai trò tức thì mà không cần reload trang.
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import type { UserRole } from '@/features/auth';
import { cn } from '@/utils/cn';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Button } from '@/components/ui/Button';

const ROLES: UserRole[] = ['GUEST', 'STUDENT', 'MENTOR', 'ADMIN'];

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  GUEST: { label: 'GUEST', color: 'text-slate-300' },
  STUDENT: { label: 'STUDENT', color: 'text-sky-300' },
  MENTOR: { label: 'MENTOR', color: 'text-violet-300' },
  ADMIN: { label: 'ADMIN', color: 'text-amber-300' },
};

export const AppLayout: React.FC = () => {
  const { role, setRole, reset } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-slate-800 antialiased">
      {/* ============== 1. ROLE SWITCHER BAR ============== */}
      <div
        className={cn(
          'sticky top-0 z-50 h-[36px] px-4',
          'bg-navy-900 text-white border-b border-slate-800',
          'flex items-center justify-between gap-3 text-xs',
        )}
        role="region"
        aria-label="Role Switcher — Thanh giả lập phân quyền"
      >
        {/* Brand mini */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center shrink-0',
              'bg-ai-gradient shadow-ai-glow',
            )}
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white whitespace-nowrap">
            PrepMaster AI
          </span>
          <span
            className={cn(
              'hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md',
              'bg-ai/15 text-ai border border-ai/30 font-semibold',
            )}
          >
            <ShieldAlert className="w-3 h-3" />
            Evaluation Mode
          </span>
        </div>

        {/* Role switcher controls */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden md:inline text-slate-400 font-medium">
            Góc nhìn phân quyền:
          </span>
          <div
            className={cn(
              'flex items-center gap-1 p-0.5 rounded-lg',
              'bg-slate-900 border border-slate-800',
            )}
            role="tablist"
            aria-label="Chọn vai trò đang xem"
          >
            {ROLES.map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRole(r)}
                  className={cn(
                    'px-2.5 h-7 rounded-md text-[11px] font-extrabold tracking-wider transition-all',
                    active
                      ? cn(
                          'bg-ai-gradient text-white shadow-ai-glow',
                        )
                      : cn(
                          ROLE_META[r].color,
                          'hover:text-white hover:bg-slate-800/80',
                        ),
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => reset()}
            leftIcon={RotateCcw}
            className="hidden lg:inline-flex text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ============== 2. WORKSPACE (Sidebar + Main) ============== */}
      <div className="flex-1 flex min-h-0">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <Header
            pageTitle={getPageTitle(location.pathname)}
          />

          {/* Canvas content */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            <Outlet />
          </main>

          {/* Footer */}
          <footer
            className={cn(
              'py-4 px-6 border-t border-slate-200 bg-white',
              'text-xs text-slate-500 flex flex-col sm:flex-row',
              'justify-between items-center gap-2',
            )}
          >
            <span>
              © 2026 PrepMaster AI · Hệ thống luyện thi IELTS / TOEIC / VSTEP
              chuẩn hoá.
            </span>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hover:text-slate-900 transition-colors font-medium"
              >
                Tài liệu API
              </a>
              <a
                href="#"
                className="hover:text-slate-900 transition-colors font-medium"
              >
                Hỗ trợ kỹ thuật
              </a>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400 font-mono">
                v0.1.0 · evaluation
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

/* Helper: map pathname -> page title hiển thị trên Header */
function getPageTitle(pathname: string): string | undefined {
  if (pathname === '/') return 'Trang chủ · Khám phá khóa học';
  if (pathname.startsWith('/exams')) return 'Khảo thí · AI Diagnostic';
  if (pathname === '/my-learning' || pathname === '/my-courses')
    return 'Phòng học của tôi';
  if (pathname.startsWith('/study/')) return 'Phòng học trực tuyến';
  if (pathname.startsWith('/schedule')) return 'Lịch học & Đặt hẹn 1-1';
  if (pathname.startsWith('/learning-path'))
    return 'Lộ trình mục tiêu & Luyện viết AI';
  if (pathname.startsWith('/mentor/grading')) return 'Chấm bài & Feedback';
  if (pathname.startsWith('/admin')) return 'Quản trị & Phân quyền';
  return undefined;
}

export default AppLayout;
