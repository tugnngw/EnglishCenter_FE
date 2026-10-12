/**
 * CourseDetailPage — Page wrapper cho CourseDetailView
 * -----------------------------------------------------------
 * Resolve course từ URL param `id`. Hiện tại chỉ resolve MOCK_COURSE
 * theo slug `ielts-intensive-mastery`. Dev 2 sau này sẽ thay bằng
 * API call: GET /api/courses/:id.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { CourseDetailView } from '@/features/courses';
import { MOCK_COURSE } from '@/mocks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Hiện tại chỉ có 1 mock course. Nếu param không khớp, hiển thị placeholder.
  // Dev 2 sẽ thay bằng: const { data, isLoading } = useCourse(id);
  if (id !== MOCK_COURSE.slug && id !== MOCK_COURSE.id) {
    return (
      <Card className="text-center py-16">
        <div className="w-16 h-16 rounded-input bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <BookOpenCheck className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Khóa học không tồn tại
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Khóa học với mã <span className="font-mono font-bold">{id}</span> chưa
          có trong hệ thống. Hãy thử khóa học mẫu{' '}
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
          onClick={() => navigate('/courses/ielts-intensive-mastery')}
        >
          Về trang chủ
        </Button>
      </Card>
    );
  }

  return <CourseDetailView course={MOCK_COURSE} />;
};

export default CourseDetailPage;
