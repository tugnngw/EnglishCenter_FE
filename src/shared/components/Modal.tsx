/**
 * Modal — hộp thoại phủ nền, trung lập (không biết nghiệp vụ).
 */

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: "md" | "lg" | "xl";
  /** Ẩn nút đóng (VD khi đang gửi dữ liệu). */
  isDismissDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  isDismissDisabled = false,
  className,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 relative",
          sizeClasses[size],
          className,
        )}
      >
        {!isDismissDisabled && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {title && (
          <div className="px-6 pt-6 pb-2 pr-12">
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
