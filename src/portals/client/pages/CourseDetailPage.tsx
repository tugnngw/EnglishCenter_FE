/**
 * CourseDetailPage — Trang chi tiết khóa học Client Portal
 */

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpenCheck, ArrowLeft } from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { CourseDetailView } from "../features/catalog";
import { useCourseDetail } from "../features/catalog";
import { MOCK_COURSE } from "@/shared/mocks";
import { ROUTES } from "@/shared/constants/routes";

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseIdOrSlug = id || "ielts-intensive-mastery";

  const { data: course, isLoading, isError } = useCourseDetail(courseIdOrSlug);

  const activeCourse = course || MOCK_COURSE;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-semibold">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (isError && !activeCourse) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="text-center py-16 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <BookOpenCheck className="w-7 h-7 text-slate-400" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Không tìm thấy khóa học
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Khóa học với mã <span className="font-mono font-bold">{id}</span>{" "}
            hiện chưa khả dụng. Hãy thử xem khóa học chính:{" "}
            <span className="font-mono font-bold text-primary">
              ielts-intensive-mastery
            </span>
            .
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-6"
            leftIcon={ArrowLeft}
            onClick={() =>
              navigate(ROUTES.COURSE_DETAIL("ielts-intensive-mastery"))
            }
          >
            Xem khóa học mẫu
          </Button>
        </Card>
      </div>
    );
  }

  return <CourseDetailView course={activeCourse} />;
};

export default CourseDetailPage;
