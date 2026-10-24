/**
 * useExamRoom — toàn bộ logic phòng thi:
 * - tải lượt thi (câu hỏi không kèm đáp án + câu đã lưu);
 * - giữ đáp án tạm ở client, autosave sau 1.5 giây kể từ lần sửa cuối;
 * - đồng hồ đếm ngược theo `remainingSeconds` của server, hết giờ thì tự nộp;
 * - nộp bài kèm các câu chưa kịp lưu; nếu server báo đã nộp / hết giờ thì chuyển sang trang kết quả.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "@/shared/constants/queryKeys";
import { ROUTES } from "@/shared/constants/routes";
import type { AnswerItemRequest, ApiError, AttemptDetail, AttemptResult, ExamQuestion } from "@/shared/types";
import { getAttempt, saveAnswers, submitAttempt } from "../api/exam.api";
import { isAnswered, orderedQuestions, type DraftAnswer } from "../utils/examRoom";

const AUTOSAVE_DELAY_MS = 1500;
/** Mã lỗi backend: lượt thi đã nộp / đã hết giờ (hệ thống tự nộp). */
const FINISHED_ERROR_CODES = [5013, 5014];

export type SaveState = "idle" | "saving" | "saved" | "error";

export function useExamRoom(attemptId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const attemptQuery = useQuery<AttemptDetail, ApiError>({
    queryKey: queryKeys.examAttempt(attemptId),
    queryFn: () => getAttempt(attemptId),
    enabled: Boolean(attemptId),
    retry: false,
    staleTime: Infinity,
  });
  const attempt = attemptQuery.data;

  const [answers, setAnswers] = useState<Record<string, DraftAnswer>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const dirtyRef = useRef<Set<string>>(new Set());
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const deadlineRef = useRef<number | null>(null);

  const goToResult = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["exam-attempts"] });
    navigate(ROUTES.EXAM_RESULT(attemptId), { replace: true });
  }, [attemptId, navigate, queryClient]);

  // Khởi tạo đáp án + đồng hồ khi tải xong lượt thi
  useEffect(() => {
    if (!attempt) return;
    if (attempt.status !== "in_progress") {
      goToResult();
      return;
    }
    const initial: Record<string, DraftAnswer> = {};
    for (const a of attempt.answers) {
      initial[a.questionId] = { selectedOptionId: a.selectedOptionId ?? null, answerText: a.answerText ?? null };
    }
    setAnswers(initial);
    deadlineRef.current = Date.now() + attempt.remainingSeconds * 1000;
    setSecondsLeft(attempt.remainingSeconds);
  }, [attempt, goToResult]);

  const questions: ExamQuestion[] = useMemo(
    () => (attempt?.exam ? orderedQuestions(attempt.exam) : []),
    [attempt],
  );

  const buildItems = (ids: Iterable<string>): AnswerItemRequest[] =>
    Array.from(ids).map((questionId) => ({
      questionId,
      selectedOptionId: answersRef.current[questionId]?.selectedOptionId ?? null,
      answerText: answersRef.current[questionId]?.answerText ?? null,
    }));

  const saveMutation = useMutation<AttemptDetail, ApiError, AnswerItemRequest[]>({
    mutationFn: (items) => saveAnswers(attemptId, items),
    onMutate: () => setSaveState("saving"),
    onSuccess: () => setSaveState("saved"),
    onError: (error, items) => {
      if (error.code !== undefined && FINISHED_ERROR_CODES.includes(error.code)) {
        goToResult();
        return;
      }
      items.forEach((i) => dirtyRef.current.add(i.questionId));
      setSaveState("error");
    },
  });

  const submitMutation = useMutation<AttemptResult, ApiError, void>({
    mutationFn: () => {
      const pending = buildItems(dirtyRef.current);
      dirtyRef.current.clear();
      return submitAttempt(attemptId, pending);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.examAttemptResult(attemptId), result);
      goToResult();
    },
    onError: (error) => {
      if (error.code !== undefined && FINISHED_ERROR_CODES.includes(error.code)) goToResult();
    },
  });

  // Autosave: gom các câu đã sửa, gửi sau khi người dùng ngừng thao tác
  useEffect(() => {
    if (dirtyRef.current.size === 0 || submitMutation.isPending) return;
    const timer = setTimeout(() => {
      const items = buildItems(dirtyRef.current);
      dirtyRef.current.clear();
      if (items.length > 0) saveMutation.mutate(items);
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
    // buildItems/saveMutation đọc ref nên chỉ cần chạy lại khi đáp án đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  // Đồng hồ đếm ngược theo deadline tuyệt đối (không lệch khi tab bị treo)
  useEffect(() => {
    if (secondsLeft === null) return;
    const timer = setInterval(() => {
      if (deadlineRef.current === null) return;
      setSecondsLeft(Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft === null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hết giờ: tự nộp một lần
  useEffect(() => {
    if (secondsLeft === 0 && !submitMutation.isPending && !submitMutation.isSuccess) {
      submitMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const setAnswer = (questionId: string, value: DraftAnswer) => {
    dirtyRef.current.add(questionId);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const answeredCount = questions.filter((q) => isAnswered(q, answers[q.questionId])).length;

  return {
    attemptQuery,
    attempt,
    questions,
    answers,
    setAnswer,
    answeredCount,
    secondsLeft: secondsLeft ?? 0,
    saveState,
    submit: () => submitMutation.mutate(),
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  };
}
