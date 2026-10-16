/**
 * AppRouter — Lazy load theo portal.
 * MUST mỗi portal là một chunk riêng: Client không tải code của Admin.
 */

import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Loading } from "@/shared/components/Loading";

const ClientRoutes = lazy(() => import("@/portals/client/routes"));
const MentorRoutes = lazy(() => import("@/portals/mentor/routes"));
const AdminRoutes = lazy(() => import("@/portals/admin/routes"));

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mentor/*" element={<MentorRoutes />} />
        <Route path="/*" element={<ClientRoutes />} />
      </Routes>
    </Suspense>
  );
}
