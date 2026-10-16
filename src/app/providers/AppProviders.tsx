/**
 * AppProviders — BrowserRouter chỉ ở đây, không lồng thêm trong portal.
 * MUST QueryClientProvider bọc ngoài cùng cho TanStack Query.
 */

import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/queryClient";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
