/**
 * ClientLayout — Shell layout cho Client Portal (Student / Public)
 *
 * Gồm:
 * - ClientSidebar (desktop)
 * - ClientHeader (topbar sticky)
 * - <Outlet /> cho sub-routes của client portal
 */

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ClientSidebar } from "./ClientSidebar";
import { ClientHeader } from "./ClientHeader";
import { useAuthStore } from "@/shared/auth";
import { ROUTES } from "@/shared/constants/routes";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Khám phá khóa học",
  [ROUTES.EXAMS]: "Khảo thí & Luyện đề",
  [ROUTES.MY_LEARNING]: "Phòng học của tôi",
  [ROUTES.SCHEDULE]: "Lịch Mentor 1-1",
  [ROUTES.LEARNING_PATH]: "Lộ trình mục tiêu & AI",
  [ROUTES.LOGIN]: "Đăng nhập tài khoản",
  [ROUTES.REGISTER]: "Đăng ký thành viên mới",
};

export const ClientLayout: React.FC = () => {
  const location = useLocation();
  const { role, userName } = useAuthStore();

  const getPageTitle = (): string => {
    if (PAGE_TITLES[location.pathname]) {
      return PAGE_TITLES[location.pathname];
    }
    if (location.pathname.startsWith("/courses/")) {
      return "Chi tiết khóa học";
    }
    if (location.pathname.startsWith("/study/")) {
      return "Phòng học trực tuyến";
    }
    return "PrepMaster AI — English Learning";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      {/* Sidebar for Desktop */}
      <ClientSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ClientHeader
          pageTitle={getPageTitle()}
          role={role}
          userName={userName}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
