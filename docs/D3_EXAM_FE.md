# Dev 3 — Frontend module Exam (D3-17)

Thay `MOCK_EXAM` bằng API thật của backend Task 3. Cấu trúc theo [CODING_RULES.md](../CODING_RULES.md):
`axiosClient` → `api/` → hook TanStack Query → component.

## Màn hình

| Route | Portal | Quyền | Nội dung |
|---|---|---|---|
| `/exams` | client | public | Ngân hàng đề: tìm kiếm, lọc loại đề / phạm vi / level, phân trang |
| `/exams/:id` | client | public | Giới thiệu đề: cấu trúc section, luật thi, quyền làm bài, nút Bắt đầu |
| `/exams/attempts/:attemptId` | client | USER, STUDENT | Phòng thi: đồng hồ theo giờ server, autosave, palette, nộp bài |
| `/exams/attempts/:attemptId/result` | client | USER, STUDENT | Kết quả: điểm tổng, theo section, từng câu, đáp án, nhận xét mentor |
| `/exams/history` | client | USER, STUDENT | Lịch sử thi |
| `/mentor/exam-grading` | mentor | MENTOR, ADMIN | Hàng đợi chấm Writing/Speaking + form chấm điểm |
| `/admin/exams` | admin | ADMIN | Danh sách đề mọi trạng thái, tạo đề |
| `/admin/exams/:examId` | admin | ADMIN | Soạn đề: section, câu hỏi (5 loại), publish / unpublish / xóa |

## File

| Phần | File |
|---|---|
| Kiểu dữ liệu (khớp DTO Spring Boot) | `src/shared/types/exam.ts` |
| Client | `src/portals/client/features/exams/` (api, hooks, utils, components), `pages/Exam*Page.tsx` |
| Mentor | `src/portals/mentor/features/exam-grading/`, `pages/ExamGradingPage.tsx` |
| Admin | `src/portals/admin/features/exam-management/`, `pages/ExamManagementPage.tsx`, `pages/ExamEditorPage.tsx` |

**File dùng chung có sửa** (cần 2 reviewer theo quy định):
- `shared/types/api.ts`: thêm `ServerResponse<T>` và `ServerPage<T>` (envelope thật của backend); thêm `ApiError.code`.
- `shared/api/interceptors.ts`: giữ lại `code` lỗi của backend (phòng thi cần mã 5013 / 5014 để biết bài đã nộp / hết giờ).
- `shared/api/unwrap.ts`: hàm lấy `result`.
- `shared/components/Modal.tsx`: hộp thoại trung lập.
- `shared/utils/format.ts`: thêm `formatDateTime`, `formatDuration`.
- `shared/constants/routes.ts`, `queryKeys.ts`: route và query key của Exam.
- `shared/types/index.ts`: export kiểu Exam mới.
- Xóa `shared/mocks/exams.mock.ts` (`MOCK_EXAM`).

**Layout:** thêm mục menu "Chấm bài thi" (`MentorLayout`) và "Quản lý Đề thi" (`AdminLayout`), cùng tiêu đề trang Exam trong `ClientLayout`.

## Hành vi phòng thi

- Đồng hồ đếm từ `remainingSeconds` của server, tính theo deadline tuyệt đối nên không lệch khi tab bị treo.
- Autosave 1.5 giây sau lần sửa cuối, chỉ gửi các câu đã đổi. Tải lại trang thì khôi phục từ server.
- Nộp bài gửi kèm các câu chưa kịp lưu. Hết giờ thì tự nộp.
- Nếu server trả `5013` (đã nộp) hoặc `5014` (hết giờ, hệ thống đã tự nộp), FE chuyển thẳng sang trang kết quả.
- Không bao giờ nhận đáp án đúng: backend ẩn `isCorrect`, đáp án điền từ và cặp nối. Câu nối hiển thị vế phải đã xáo theo thứ tự chữ cái.

## Chạy

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Vấn đề có sẵn trong repo (không thuộc Task 3, chưa sửa)

- `npm run build` lỗi: `LoginPage.tsx` / `RegisterPage.tsx` import `useAuthStore` từ `@/shared/stores` (đúng ra là `@/shared/auth`). Khi sửa 2 dòng này thì build qua, kể cả toàn bộ code Exam.
- `shared/api/auth.api.ts` gọi `/v1/users/me`, nhưng backend là `/v1/account/me` (trả `role` dạng chuỗi, không phải `roles[]`), nên đăng nhập thật chưa chạy.
- `CourseDetailView` / `MyCoursesView` còn link cứng `/exams/ielts-mock-01`. Đề này không còn, nên trang hiện "Đề thi không tồn tại".
