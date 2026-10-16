# PrepMaster AI — English Center Frontend

Hệ thống quản lý trung tâm tiếng Anh & Luyện thi IELTS tích hợp AI (IELTS Intensive Mastery).
Dự án được xây dựng theo chuẩn kiến trúc Doanh nghiệp phân lớp (Enterprise Multi-Portal Architecture) và tuân thủ nghiêm ngặt theo [CODING_RULES.md](./CODING_RULES.md).

---

## 🏛️ Kiến trúc 3 tầng phân lập (3-Tier Architecture)

```
src/
├── app/                              # Khởi động ứng dụng & Định tuyến tổng
│   ├── providers/AppProviders.tsx    # Bọc QueryClientProvider, BrowserRouter
│   ├── router/AppRouter.tsx          # Lazy-load từng Portal (Code Splitting)
│   └── App.tsx                       # Root component
│
├── portals/                          # Cổng làm việc theo đối tượng người dùng
│   ├── client/                       # Dành cho Khách & Học viên (Student)
│   │   ├── layouts/                  # ClientLayout, ClientHeader, ClientSidebar
│   │   ├── features/                 # auth, catalog, checkout, learning, exams, schedules, ai-practice
│   │   ├── pages/                    # HomePage, CourseDetailPage, ExamRoomPage, MyCoursesPage, StudyRoomPage, SchedulePage, LearningPathPage...
│   │   └── routes.tsx                # Module định tuyến của Client Portal (mount tại /*)
│   │
│   ├── mentor/                       # Dành cho Giảng viên (Mentor Workspace)
│   │   ├── layouts/                  # MentorLayout (Sidebar & Topbar riêng)
│   │   ├── features/                 # assignment (Dashboard, Chấm bài Writing & Speaking với AI Rubric)
│   │   ├── pages/                    # MentoringDashboardPage, GradingPage
│   │   └── routes.tsx                # Module định tuyến của Mentor Portal (mount tại /mentor/*)
│   │
│   └── admin/                        # Dành cho Quản trị viên (Admin Console)
│       ├── layouts/                  # AdminLayout (Sidebar & Topbar riêng)
│       ├── features/                 # course-management, account-management, revenue
│       ├── pages/                    # CourseManagementPage, AccountManagementPage, RevenueReportPage
│       └── routes.tsx                # Module định tuyến của Admin Portal (mount tại /admin/*)
│
└── shared/                           # Dùng chung trung lập (Zero portal dependency)
    ├── api/                          # axiosClient, queryClient, interceptors, auth.api
    ├── auth/                         # useAuthStore (Zustand, multi-role evaluation switcher)
    ├── components/                   # Button, Card, Badge, Loading, ProtectedRoute
    ├── config/                       # env.ts (VITE_API_URL, PayOS config)
    ├── constants/                    # ROLES, ROUTES, queryKeys
    ├── stores/                       # useEnrollmentStore
    ├── types/                        # User, Course, Exam, Payment, Learning, API types
    └── utils/                        # cn, formatVND, formatCurrency, formatDate, countWords
```

---

## 🔒 Quy tắc biên giới và đóng gói

1. **Không import chéo portal**: `client`, `mentor`, `admin` hoàn toàn độc lập, không import qua lại lẫn nhau.
2. **`shared/` độc lập tuyệt đối**: Không bao giờ import từ `portals/` hoặc `app/`.
3. **Đóng gói Feature qua `index.ts`**: Mọi consuming page và layout chỉ import component và hook được export từ barrel file `index.ts` của feature.
4. **Không chuỗi ma thuật (Zero Magic Strings)**: Tất cả đường dẫn được tham chiếu qua `ROUTES` (`ROUTES.CLIENT.*`, `ROUTES.MENTOR.*`, `ROUTES.ADMIN.*`) và `ROLES`.
5. **Phân tách Server state vs Client state**:
   - Dữ liệu server: TanStack Query (`useQuery`, `useMutation`).
   - Trạng thái client/session: Zustand (`useAuthStore`, `useEnrollmentStore`).

---

## 🚀 Trải nghiệm Gold Flow & Chế độ Đánh giá (Evaluation Mode)

Hệ thống tích hợp thanh **Role Switcher** tại Header của tất cả các portal (`GUEST` / `STUDENT` / `MENTOR` / `ADMIN`):
- **GUEST**: Xem chi tiết khóa học, lộ trình học, bài thi thử IELTS.
- **STUDENT**: Đăng ký khóa học, thanh toán VietQR / PayOS thời gian thực, vào phòng học trực tuyến (Study Room), nộp bài tập, đặt lịch học 1-1, luyện viết AI.
- **MENTOR**: Bảng điều khiển công việc, chấm bài Writing/Speaking học viên nộp với gợi ý AI Rubric.
- **ADMIN**: Quản lý danh mục khóa học, phân quyền tài khoản thành viên, báo cáo doanh thu & giao dịch.

---

## 🛠️ Lệnh chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển
npm run dev

# Kiểm tra lint
npm run lint

# Build production
npm run build
```
