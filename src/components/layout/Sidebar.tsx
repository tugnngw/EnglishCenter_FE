/**
 * Sidebar — Dark Navy navigation của PrepMaster AI
 * -----------------------------------------------------------
 * Tính năng:
 *   - Nền navy-900 (#0F172A), border-slate-800
 *   - Logo "PrepMaster AI" với gradient Blue→Violet
 *   - Navigation items lọc động theo role hiện tại
 *   - Active item: nền primary/15 + border trái Electric Violet/Blue
 *   - Collapsible: w-64 ↔ w-20 (nút chevron tròn nổi)
 *   - Footer: avatar tròn + tên + role badge + nút đăng xuất / chuyển tài khoản
 *   - Tooltip khi thu gọn
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  Calendar,
  PenTool,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  Sparkles,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import { useAuthStore, ROLE_MOCK_PROFILE } from '@/features/auth';
import type { UserRole } from '@/features/auth';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';

export interface SidebarProps {
  /** Có thể ẩn nút collapse khi dùng trong màn hình nhỏ */
  collapsible?: boolean;
  /** Class bổ sung cho thẻ aside */
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: {
    label: string;
    variant: 'ai' | 'primary' | 'warning';
  };
  roles: UserRole[];
  description?: string;
}

const NAVIGATION: NavItem[] = [
  {
    name: 'Khám phá khóa học',
    href: '/',
    icon: BookOpen,
    roles: ['GUEST', 'STUDENT', 'MENTOR', 'ADMIN'],
    description: 'Danh mục khóa học luyện thi',
  },
  {
    name: 'Khảo thí & Luyện đề',
    href: '/exams',
    icon: FileCheck2,
    badge: { label: 'AI Diagnostic', variant: 'ai' },
    roles: ['GUEST', 'STUDENT', 'MENTOR', 'ADMIN'],
    description: 'Ngân hàng đề thi & AI chấm tự động',
  },
  {
    name: 'Phòng học của tôi',
    href: '/my-learning',
    icon: GraduationCap,
    badge: { label: 'Đang học', variant: 'primary' },
    roles: ['STUDENT'],
    description: 'Lộ trình cá nhân hoá & tiến độ',
  },
  {
    name: 'Lịch Mentor 1-1',
    href: '/schedule',
    icon: Calendar,
    roles: ['STUDENT', 'MENTOR'],
    description: 'Đặt lịch & phòng học trực tuyến',
  },
  {
    name: 'Chấm bài & Feedback',
    href: '/mentor/grading',
    icon: PenTool,
    roles: ['MENTOR'],
    description: 'Hàng chờ chấm bài & nhận xét',
  },
  {
    name: 'Quản trị & Phân quyền',
    href: '/admin',
    icon: ShieldCheck,
    roles: ['ADMIN'],
    description: 'Quản lý người dùng & hệ thống',
  },
];

const ROLE_BADGE_VARIANT: Record<UserRole, 'primary' | 'ai' | 'warning' | 'neutral'> = {
  GUEST: 'neutral',
  STUDENT: 'primary',
  MENTOR: 'ai',
  ADMIN: 'warning',
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsible = true,
  className,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, userName, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNav = NAVIGATION.filter((item) => item.roles.includes(role));
  const profile = ROLE_MOCK_PROFILE[role];
  const avatarInitial = (userName || profile.fullName).charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-navy-900 border-r border-slate-800 text-slate-200',
        'transition-[width] duration-300 ease-in-out',
        'sticky top-[36px] h-[calc(100vh-36px)] z-30',
        isCollapsed ? 'w-20' : 'w-64',
        className,
      )}
      aria-label="Sidebar điều hướng chính"
    >
      {/* ====================== LOGO HEADER ====================== */}
      <div
        className={cn(
          'flex items-center h-[68px] border-b border-slate-800 shrink-0',
          isCollapsed ? 'justify-center px-3' : 'px-5 gap-3',
        )}
      >
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 group min-w-0',
            isCollapsed && 'justify-center',
          )}
          title="PrepMaster AI — Trang chủ"
        >
          {/* Logo mark: BookOpen + Sparkles, gradient Blue→Violet */}
          <div className="relative w-10 h-10 rounded-input bg-ai-gradient flex items-center justify-center shadow-ai-glow shrink-0">
            <BookOpenCheck className="w-5 h-5 text-white" strokeWidth={2.4} />
            <Sparkles
              className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 drop-shadow"
              strokeWidth={2.5}
            />
          </div>
          {!isCollapsed && (
            <div className="leading-none min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-[17px] tracking-tight text-white truncate">
                  PrepMaster
                </span>
                <span
                  className={cn(
                    'text-[12px] font-extrabold tracking-wider text-ai uppercase',
                    'px-1.5 py-0.5 rounded-md border border-ai/40',
                    'shadow-[0_0_12px_-2px_rgba(124,58,237,0.55)]',
                  )}
                >
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-[0.14em] uppercase mt-1.5">
                Diagnostic Exam Workspace
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* ====================== TOGGLE BUTTON ====================== */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setIsCollapsed((s) => !s)}
          className={cn(
            'absolute -right-3 top-[78px] z-40',
            'w-6 h-6 rounded-full bg-white border border-slate-200',
            'flex items-center justify-center shadow-md',
            'text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors',
          )}
          title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* ====================== NAVIGATION ====================== */}
      <nav
        className="flex-1 overflow-y-auto py-5 px-3 space-y-1"
        aria-label="Danh mục điều hướng"
      >
        {!isCollapsed && (
          <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            Phân hệ nghiệp vụ
          </p>
        )}

        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname === item.href ||
                location.pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-input font-medium text-sm transition-all',
                isCollapsed ? 'justify-center h-11 w-12 mx-auto' : 'px-3 py-2.5',
                isActive
                  ? 'bg-primary/15 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
              title={isCollapsed ? item.name : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator: thanh trái Electric Violet/Blue */}
              {isActive && (
                <span
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full',
                    'bg-ai shadow-[0_0_10px_rgba(124,58,237,0.7)]',
                  )}
                  aria-hidden="true"
                />
              )}

              <Icon
                className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-colors',
                  isActive ? 'text-ai' : 'text-slate-400 group-hover:text-white',
                )}
                strokeWidth={2}
              />

              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge.variant}
                      size="sm"
                      className="font-extrabold tracking-wider"
                    >
                      {item.badge.label}
                    </Badge>
                  )}
                </>
              )}

              {/* Tooltip khi thu gọn */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <div className="font-semibold">{item.name}</div>
                  {item.description && (
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ====================== FOOTER PROFILE ====================== */}
      <div
        className={cn(
          'border-t border-slate-800 p-3 shrink-0',
          isCollapsed && 'flex justify-center',
        )}
      >
        <div
          className={cn(
            'group relative rounded-input bg-slate-800/50 border border-slate-700/60',
            'hover:border-slate-600 transition-colors',
            isCollapsed ? 'p-1.5' : 'p-2.5',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-3',
              isCollapsed && 'justify-center',
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white text-sm shrink-0',
                'shadow-md',
              )}
              style={{ background: profile.avatarColor }}
              aria-hidden="true"
            >
              {avatarInitial}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 leading-tight">
                <div className="font-semibold text-[13px] text-white truncate">
                  {userName}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge
                    variant={ROLE_BADGE_VARIANT[role]}
                    size="sm"
                    className="tracking-wider"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
            )}

            {!isCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tooltip + logout khi thu gọn */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 bottom-0 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <div className="font-semibold">{userName}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {role} · PrepMaster AI
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-md bg-status-danger text-white text-[11px] font-semibold hover:bg-red-600"
              >
                <LogOut className="w-3 h-3" />
                Đăng xuất
              </button>
            </div>
          )}

          {/* Khi mở rộng: nút "Chuyển tài khoản" dạng text dưới cùng */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <ChevronsUpDown className="w-3 h-3" />
              Chuyển tài khoản
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
