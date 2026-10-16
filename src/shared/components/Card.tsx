/**
 * Card — Surface chuẩn dự án.
 * Bo góc rounded-card (16px), nền trắng, border slate-200/80.
 */

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  noPadding?: boolean;
}

export function Card({
  className,
  children,
  hoverable = false,
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-card border border-slate-200/80 shadow-elevation transition-all",
        !noPadding && "p-6",
        hoverable && "hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
