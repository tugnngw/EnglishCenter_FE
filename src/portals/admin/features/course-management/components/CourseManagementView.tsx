/**
 * CourseManagementView — Quản lý danh mục khóa học dành cho Admin
 */

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { formatCurrency } from "@/shared/utils";

interface AdminCourseItem {
  id: string;
  code: string;
  title: string;
  targetBand: string;
  price: number;
  originalPrice: number;
  totalStudents: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  updatedAt: string;
}

const MOCK_ADMIN_COURSES: AdminCourseItem[] = [
  {
    id: "ielts-intensive-mastery",
    code: "IELTS-75",
    title: "IELTS Intensive Mastery 7.5+ (Gold Flow)",
    targetBand: "7.5+",
    price: 3490000,
    originalPrice: 4990000,
    totalStudents: 1248,
    status: "ACTIVE",
    updatedAt: "15/10/2026",
  },
  {
    id: "ielts-foundation-50",
    code: "IELTS-50",
    title: "IELTS Foundation & Phát âm chuẩn Cambridge",
    targetBand: "5.0 - 5.5",
    price: 2190000,
    originalPrice: 3200000,
    totalStudents: 856,
    status: "ACTIVE",
    updatedAt: "10/10/2026",
  },
  {
    id: "ielts-writing-masterclass",
    code: "IELTS-WRI",
    title: "Chuyên sâu IELTS Writing Task 1 & 2 với AI",
    targetBand: "6.5 - 7.5",
    price: 1890000,
    originalPrice: 2500000,
    totalStudents: 412,
    status: "ACTIVE",
    updatedAt: "08/10/2026",
  },
  {
    id: "ielts-speaking-vip",
    code: "IELTS-SPK",
    title: "Luyện phản xạ Speaking 1-1 với Mentor Bản ngữ",
    targetBand: "7.0+",
    price: 4200000,
    originalPrice: 5500000,
    totalStudents: 190,
    status: "DRAFT",
    updatedAt: "01/10/2026",
  },
];

export const CourseManagementView: React.FC = () => {
  const [courses, setCourses] = useState<AdminCourseItem[]>(MOCK_ADMIN_COURSES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = courses.filter((c) => {
    if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.targetBand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            Quản lý Khóa học & Lộ trình
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cấu hình chương trình đào tạo, giá bán, thời lượng và trạng thái phát hành
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setShowAddModal(true)}
          className="shadow-sm"
        >
          Tạo khóa học mới
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên khóa học, mục tiêu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang mở bán (Active)</option>
              <option value="DRAFT">Bản nháp (Draft)</option>
              <option value="ARCHIVED">Lưu trữ (Archived)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Courses Table */}
      <Card className="overflow-hidden p-0 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã & Tên khóa học</th>
                <th className="py-3.5 px-4">Mục tiêu</th>
                <th className="py-3.5 px-4">Học phí</th>
                <th className="py-3.5 px-4">Học viên</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Cập nhật</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <p className="font-bold text-slate-900 mt-1">{c.title}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="ai" size="sm">
                      {c.targetBand}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-slate-900">
                      {formatCurrency(c.price)}
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      {formatCurrency(c.originalPrice)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-400" />
                      {c.totalStudents}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        c.status === "ACTIVE"
                          ? "success"
                          : c.status === "DRAFT"
                          ? "neutral"
                          : "danger"
                      }
                      size="sm"
                    >
                      {c.status === "ACTIVE"
                        ? "Đang mở bán"
                        : c.status === "DRAFT"
                        ? "Bản nháp"
                        : "Đã đóng"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">
                    {c.updatedAt}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Xem chi tiết"
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Chỉnh sửa"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simple Create Course Modal Mock */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Thêm khóa học mới vào hệ thống
            </h3>
            <p className="text-xs text-slate-500">
              Điền thông tin khóa học cơ bản. Module nội dung có thể bổ sung sau.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên khóa học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: IELTS Advanced Speaking 8.0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã khóa
                  </label>
                  <input
                    type="text"
                    placeholder="IELTS-80"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Học phí (VND)
                  </label>
                  <input
                    type="number"
                    placeholder="3500000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(false)}
              >
                Lưu khóa học
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseManagementView;
