/**
 * ExamStateCard — khung báo lỗi / trống dùng chung trong feature exams.
 */

import React from "react";
import { AlertTriangle, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

interface ExamStateCardProps {
  tone: "error" | "empty";
  title: string;
  message?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
}

export function ExamStateCard({ tone, title, message, onRetry, action }: ExamStateCardProps) {
  const Icon = tone === "error" ? AlertTriangle : FileText;
  return (
    <Card className="text-center py-14">
      <div
        className={
          tone === "error"
            ? "w-14 h-14 rounded-2xl bg-status-danger-bg text-status-danger flex items-center justify-center mx-auto mb-4"
            : "w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4"
        }
      >
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      {message && <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">{message}</p>}
      <div className="mt-6 flex items-center justify-center gap-2">
        {onRetry && (
          <Button variant="outline" leftIcon={RotateCcw} onClick={onRetry}>
            Thử lại
          </Button>
        )}
        {action}
      </div>
    </Card>
  );
}
