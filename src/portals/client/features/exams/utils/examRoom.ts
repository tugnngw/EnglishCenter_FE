import type { ExamDetail, ExamQuestion } from "@/shared/types";

/** Đáp án đang làm ở client (chưa chắc đã lưu lên server). */
export interface DraftAnswer {
  selectedOptionId?: string | null;
  /** fill_blank / essay: chữ; matching: JSON {"trái": "phải"}. */
  answerText?: string | null;
}

/** Toàn bộ câu hỏi theo thứ tự hiển thị (displayNumber do backend đánh). */
export function orderedQuestions(exam: ExamDetail): ExamQuestion[] {
  const all = [
    ...exam.sections.flatMap((s) => s.questions ?? []),
    ...(exam.unsectionedQuestions ?? []),
  ];
  return all.sort((a, b) => (a.displayNumber ?? 0) - (b.displayNumber ?? 0));
}

export function parseMatching(text?: string | null): Record<string, string> {
  if (!text) return {};
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== "",
        ),
      );
    }
  } catch {
    /* JSON hỏng = chưa trả lời */
  }
  return {};
}

export function isAnswered(question: ExamQuestion, draft?: DraftAnswer): boolean {
  if (!draft) return false;
  switch (question.questionType) {
    case "multiple_choice":
    case "true_false":
      return Boolean(draft.selectedOptionId);
    case "matching":
      return Object.keys(parseMatching(draft.answerText)).length > 0;
    default:
      return Boolean(draft.answerText && draft.answerText.trim());
  }
}
