import React from "react";
import { cn } from "@/shared/utils/cn";

export const FIELD_CLASS =
  "w-full px-3 py-2 rounded-input border border-slate-200 bg-white text-sm font-normal text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary";

interface FieldProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

/** Nhãn + ô nhập dùng trong các form quản lý đề. */
export function Field({ label, className, children }: FieldProps) {
  return (
    <label className={cn("block text-xs font-bold text-slate-600 space-y-1", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}
