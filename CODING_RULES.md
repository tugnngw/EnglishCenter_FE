# Quy tắc code – SBA Frontend

Áp dụng cho cấu trúc `app/` · `portals/{client,mentor,admin}` · `shared/`.
Đặt file này ở gốc repo (hoặc `docs/`) và link từ `README.md`.

> Mức độ: **MUST** = bắt buộc (ESLint hoặc review sẽ chặn) · **SHOULD** = nên làm · **AVOID** = tránh.

---

## 1. Cấu trúc và import

1. **MUST** dùng alias `@/` cho mọi import vượt quá cùng một feature. Không dùng `../../../`.
2. **MUST** cấm import chéo portal: `client`, `mentor`, `admin` không import lẫn nhau.
3. **MUST** `shared/` không import từ `portals/` hoặc `app/`.
4. **MUST** import feature qua `index.ts` của nó, không import sâu vào file bên trong:
   ```ts
   // Đúng
   import { CourseCard } from "@/portals/client/features/catalog";
   // Sai
   import CourseCard from "@/portals/client/features/catalog/components/CourseCard";
   ```
   Feature khác trong cùng portal cũng chỉ được dùng phần đã export ở `index.ts`.
5. **MUST** thứ gì dùng từ **2 portal trở lên** thì chuyển lên `shared/`. Thứ chỉ một portal dùng thì ở lại feature của portal đó. Không copy-paste code giữa các portal.
6. **SHOULD** chỉ tạo thư mục khi có file để bỏ vào. Không tạo trước `store/`, `types/`, `hooks/` rỗng.
7. **SHOULD** thứ tự import: thư viện ngoài, rồi `@/shared`, rồi `@/portals`, rồi import tương đối, cuối cùng là style.

## 2. Đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Thư mục | `kebab-case`, không viết tắt | `account-management` |
| Component, page, layout | `PascalCase.tsx`, tên file trùng tên component | `CourseCard.tsx` |
| Page | kết thúc bằng `Page` | `GradingPage.tsx` |
| Layout | kết thúc bằng `Layout` | `AdminLayout.tsx` |
| Hook | `useXxx.ts` | `useCourseList.ts` |
| API function | động từ + danh từ | `getCourses`, `createCourse` |
| Hàm tiện ích, file util | `camelCase` | `formatDate.ts` |
| Type, interface | `PascalCase`, không tiền tố `I` | `Course`, `CreateCourseRequest` |
| Hằng số | `UPPER_SNAKE_CASE` hoặc object `as const` | `ROLES`, `ROUTES` |
| Biến boolean | tiền tố `is/has/can/should` | `isLoading`, `hasPurchased` |
| Event handler | `handleXxx` (định nghĩa), `onXxx` (prop) | `handleSubmit`, `onSubmit` |

Tên feature lấy từ nghiệp vụ (`course-management`), không lấy từ kỹ thuật (`course-crud`).

## 3. TypeScript

1. **MUST** bật `strict: true`.
2. **MUST NOT** dùng `any`. Chưa biết kiểu thì dùng `unknown` rồi thu hẹp, hoặc để lại `// TODO(tên): lý do` kèm `eslint-disable` đúng dòng.
3. **MUST** khai báo kiểu cho props, giá trị trả về của API function và hook công khai.
4. **MUST** import kiểu bằng `import type { ... }`.
5. **SHOULD** dùng `type` cho union và alias, `interface` cho object có thể mở rộng.
6. **SHOULD** dùng union hoặc `as const` thay cho `enum`:
   ```ts
   export const SUBMISSION_STATUS = { PENDING: "PENDING", GRADED: "GRADED" } as const;
   export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];
   ```
7. **MUST** kiểu dữ liệu từ API khớp DTO của Spring Boot. Nếu có OpenAPI thì generate vào `shared/api/generated/` và **không sửa tay** file generated.
8. **SHOULD** type cơ bản dùng chung ở `shared/types/`. DTO riêng của từng portal (ví dụ trường doanh thu của Admin) để trong `features/<tên>/types/`.

## 4. Component React

1. **MUST** dùng function component, không dùng class.
2. **MUST** một file một component chính. `export default` cho page và layout; `export` có tên cho component dùng lại.
3. **SHOULD** component dưới khoảng 150 dòng. Dài hơn thì tách component con hoặc tách logic ra hook.
4. **MUST** tách logic và hiển thị: component chỉ render, gọi API và xử lý dữ liệu nằm trong hook.
5. **MUST** `key` ổn định cho danh sách (dùng `id`, không dùng `index` nếu danh sách có thể đổi thứ tự).
6. **AVOID** truyền props qua quá 2 tầng. Cân nhắc composition hoặc context.
7. **AVOID** logic phân quyền trong component để quyết định có render hay không. Phân quyền ở `ProtectedRoute`, ẩn nút theo role chỉ để cải thiện UX.
8. **MUST** page chỉ ghép feature và layout lại, không chứa logic nghiệp vụ nặng.
9. **SHOULD** component trong `shared/components/` phải trung lập: không biết gì về khóa học, mentor hay admin.

```tsx
// Ví dụ một component gọn
interface CourseCardProps {
  course: Course;
  onSelect: (id: string) => void;
}

export function CourseCard({ course, onSelect }: CourseCardProps) {
  return <button onClick={() => onSelect(course.id)}>{course.title}</button>;
}
```

## 5. Hook

1. **MUST** tên bắt đầu bằng `use`, đặt trong `hooks/` của feature (hoặc `shared/hooks/` nếu dùng chung).
2. **MUST** tuân thủ rules of hooks (ESLint `react-hooks` bật ở mức `error`).
3. **MUST** dependency array của `useEffect`, `useMemo`, `useCallback` đầy đủ. Không tắt cảnh báo `exhaustive-deps` trừ khi có comment lý do.
4. **AVOID** dùng `useEffect` để gọi API. Dùng TanStack Query (mục 6).
5. **AVOID** `useMemo`, `useCallback` khi chưa có vấn đề hiệu năng thực sự.

## 6. Gọi API và server state

Luồng chuẩn: `axiosClient` → hàm trong `api/` → hook `useQuery/useMutation` → component.

1. **MUST** mọi request đi qua `axiosClient` (`shared/api`). Không `fetch` hoặc `axios.create` riêng.
2. **MUST** hàm API chỉ gọi và trả dữ liệu, không chứa logic UI:
   ```ts
   // features/catalog/api/getCourses.ts
   export async function getCourses(): Promise<Course[]> {
     const { data } = await axiosClient.get<Course[]>("/courses");
     return data;
   }
   ```
3. **MUST** dữ liệu từ server dùng `useQuery`, thao tác ghi dùng `useMutation`.
4. **MUST** query key khai báo tập trung ở `shared/constants/queryKeys.ts`, không viết chuỗi rải rác.
5. **MUST** sau mutation thành công thì `invalidateQueries` đúng key liên quan.
   ```ts
   export function useCourses() {
     return useQuery({ queryKey: queryKeys.courses, queryFn: getCourses });
   }
   ```
6. **MUST** URL, base URL lấy từ `env` (`VITE_API_URL`), không hard-code.
7. **MUST** xử lý đủ 3 trạng thái ở mọi chỗ hiển thị dữ liệu: loading, error, empty.
8. **MUST NOT** lưu dữ liệu server trong Context hoặc Zustand để cache. Cache là việc của TanStack Query.
9. **SHOULD** lỗi chuẩn hóa ở `interceptors.ts` thành `ApiError { status, message }` để UI chỉ xử lý một dạng.

## 7. State management

Chọn theo thứ tự ưu tiên, dừng ở lựa chọn đầu tiên đủ dùng:

1. State cục bộ của một component: `useState`.
2. State của form: thư viện form (React Hook Form) hoặc `useState` nếu form nhỏ.
3. State lọc, phân trang, tab: **URL search params** nếu cần chia sẻ hoặc refresh giữ nguyên.
4. Dữ liệu từ server: TanStack Query.
5. State dùng chung nhiều nơi (auth, theme): Context trong `shared/` hoặc `app/providers/`. Chỉ thêm Zustand khi nhóm thống nhất.

**MUST** chọn một cách cho state toàn cục và dùng nhất quán trong cả dự án.

## 8. Routing và phân quyền

1. **MUST** đường dẫn khai báo trong `shared/constants/routes.ts`, không viết chuỗi `"/mentor/..."` rải rác.
2. **MUST** route trong từng portal dùng **đường dẫn tương đối** (portal được mount tại `/mentor/*`, `/admin/*`).
3. **MUST** mỗi portal có `routes.tsx` với `export default` một component để `React.lazy` hoạt động.
4. **MUST** `BrowserRouter` chỉ ở `AppProviders`.
5. **MUST** route cần đăng nhập hoặc role đều bọc bằng `ProtectedRoute`.
6. **MUST** Backend kiểm tra role ở mỗi API. Guard ở FE chỉ để cải thiện trải nghiệm, không phải bảo mật.
7. **MUST** role dùng hằng `ROLES`, khớp với role trong JWT của Spring Boot. "Student" là trạng thái đã mua khóa học (từ enrollment), không tự tạo role nếu BE không có.
8. **MUST NOT** lưu dữ liệu nhạy cảm ngoài token trong `localStorage`. Hiểu rằng `localStorage` có thể bị đọc nếu có lỗ hổng XSS; nếu BE hỗ trợ, ưu tiên cookie `HttpOnly`.

## 9. Form và validation

1. **MUST** validate ở FE để báo lỗi nhanh, nhưng **không tin FE**. Backend vẫn validate.
2. **SHOULD** dùng schema validation (Zod) và dùng chung schema với kiểu TypeScript (`z.infer`).
3. **MUST** hiển thị lỗi theo từng trường và lỗi tổng từ server.
4. **MUST** vô hiệu hóa nút submit khi đang gửi để tránh gửi trùng.

## 10. Xử lý lỗi và trạng thái giao diện

1. **MUST** không để lỗi API làm trắng trang. Có thông báo lỗi và hành động thử lại.
2. **SHOULD** đặt Error Boundary ở cấp `app/` và cấp từng portal.
3. **MUST** không `console.log` trong code commit. Dùng `console.error` có chủ đích cho lỗi, hoặc logger chung.
4. **MUST** text hiển thị cho người dùng (thông báo, nhãn) nhất quán ngôn ngữ; nếu cần đa ngôn ngữ sau này thì gom vào một chỗ ngay từ đầu.

## 11. Styling

1. **MUST** chọn một cách chính (CSS Modules, Tailwind hoặc UI library) và dùng thống nhất. Không trộn nhiều cách trong cùng portal.
2. **MUST** style global chỉ ở `styles/index.css`.
3. **AVOID** inline style, trừ giá trị động.
4. **MUST** màu, spacing, font dùng token hoặc biến, không hard-code lặp lại.
5. **SHOULD** component trong `shared/components/` nhận `className` để portal tùy biến.

## 12. Hiệu năng

1. **MUST** lazy load theo portal (đã có trong `AppRouter`). Trang nặng trong portal cũng nên `React.lazy`.
2. **SHOULD** danh sách dài dùng phân trang phía server (BE Spring dùng `Page`), không tải hết.
3. **SHOULD** debounce ô tìm kiếm trước khi gọi API.
4. **AVOID** import cả thư viện lớn khi chỉ dùng một hàm.

## 13. Test

1. **SHOULD** có test cho: hàm util, hook có logic, `ProtectedRoute` (3 nhánh: chưa đăng nhập, sai role, đúng role).
2. **SHOULD** test đặt cạnh file: `CourseCard.test.tsx`.
3. **MUST** sửa bug thì cố gắng thêm test tái hiện bug trước khi sửa.

## 14. Git và review

**Branch**: `feature/<portal>-<mô-tả>`, `fix/<mô-tả>`, `refactor/<mô-tả>`.
Ví dụ: `feature/admin-course-management`.

**Commit** theo Conventional Commits:
```
feat(admin): thêm trang quản lý khóa học
fix(client): sửa lỗi phân trang danh sách khóa học
refactor(shared): chuyển axios vào shared/api
chore: cập nhật eslint boundaries
```

**Pull Request**
1. **MUST** nhỏ và tập trung một việc. Refactor di chuyển file tách riêng khỏi thay đổi logic.
2. **MUST** mỗi PR có ít nhất 1 người review; PR sửa `shared/` cần **2 người** review.
3. **MUST** không push trực tiếp lên `main`/`develop`.
4. **MUST** PR chỉ merge khi lint, type-check và build đều qua.
5. **SHOULD** có ảnh chụp màn hình khi thay đổi giao diện.
6. **SHOULD** người review phản hồi trong 1 ngày làm việc.

**Ownership gợi ý** (`CODEOWNERS`): mỗi portal một người chịu trách nhiệm chính, `shared/` và `app/` do người phụ trách infra.

## 15. Công cụ bắt buộc

- **ESLint**: `react-hooks`, `@typescript-eslint`, và rule `no-restricted-imports` (xem `eslint.boundaries.example.js`).
- **Prettier**: cấu hình chung cho cả nhóm, ví dụ `semi: true`, `singleQuote: false`, `printWidth: 100`, `trailingComma: "es5"`.
- **Husky + lint-staged** (nên có): chạy lint và format trước khi commit.
- **Scripts** trong `package.json`: `lint`, `type-check` (`tsc --noEmit`), `build`. CI chạy cả ba.

## 16. Checklist trước khi mở PR

- [ ] Chạy `lint`, `type-check`, `build` đều qua.
- [ ] Không còn `any`, `console.log`, code comment bỏ đi.
- [ ] Import qua `@/` và qua `index.ts` của feature; không import chéo portal.
- [ ] Dùng hằng `ROLES`, `ROUTES`, `queryKeys`; không hard-code.
- [ ] Có xử lý loading, error, empty cho dữ liệu từ API.
- [ ] Không lưu dữ liệu server ngoài TanStack Query.
- [ ] Đặt tên đúng quy ước (mục 2).
- [ ] Nếu sửa `shared/`: đã báo nhóm và có 2 reviewer.
- [ ] Mô tả PR rõ việc đã làm và cách kiểm thử.
