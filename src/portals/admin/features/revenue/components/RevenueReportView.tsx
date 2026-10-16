/**
 * RevenueReportView — Báo cáo doanh thu & Lịch sử giao dịch thanh toán VietQR / PayOS
 */

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  QrCode,
  Download,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Card } from "@/shared/components/Card";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { formatCurrency } from "@/shared/utils";

interface TransactionItem {
  id: string;
  orderCode: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  method: "VIETQR" | "PAYOS" | "MOMO";
  status: "PAID" | "PENDING" | "FAILED";
  paidAt: string;
}

const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-01",
    orderCode: "ORD-172901",
    studentName: "Nguyễn Văn A",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    amount: 3490000,
    method: "VIETQR",
    status: "PAID",
    paidAt: "16/10/2026 14:25",
  },
  {
    id: "tx-02",
    orderCode: "ORD-172895",
    studentName: "Trần Bảo Nam",
    courseTitle: "IELTS Foundation 5.0",
    amount: 2190000,
    method: "PAYOS",
    status: "PAID",
    paidAt: "16/10/2026 11:10",
  },
  {
    id: "tx-03",
    orderCode: "ORD-172880",
    studentName: "Lê Hoàng Yến",
    courseTitle: "Chuyên sâu IELTS Writing Task 1 & 2 với AI",
    amount: 1890000,
    method: "VIETQR",
    status: "PAID",
    paidAt: "15/10/2026 19:40",
  },
  {
    id: "tx-04",
    orderCode: "ORD-172855",
    studentName: "Phạm Minh Quang",
    courseTitle: "IELTS Intensive Mastery 7.5+",
    amount: 3490000,
    method: "PAYOS",
    status: "PAID",
    paidAt: "15/10/2026 15:15",
  },
  {
    id: "tx-05",
    orderCode: "ORD-172820",
    studentName: "Đặng Tiến Dũng",
    courseTitle: "Luyện phản xạ Speaking 1-1 với Mentor Bản ngữ",
    amount: 4200000,
    method: "VIETQR",
    status: "PAID",
    paidAt: "14/10/2026 09:30",
  },
];

export const RevenueReportView: React.FC = () => {
  const [transactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            Báo cáo Doanh thu & Cổng Thanh toán
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng hợp giao dịch VietQR và PayOS, tỷ lệ kích hoạt khóa học tự động
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={Download}
          onClick={() => alert("Xuất báo cáo doanh thu CSV thành công!")}
        >
          Xuất báo cáo Excel
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Doanh thu tháng này
            </p>
            <p className="text-xl lg:text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(totalRevenue + 85400000)}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4% so với tháng trước
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Giao dịch thành công
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">324</p>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">Tỷ lệ thanh toán 98.2%</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              VietQR Tự động khớp
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">84%</p>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">Webhook trung bình &lt; 2s</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Giá trị TB / Đơn (AOV)
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {formatCurrency(3150000)}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Combo khóa học phổ biến</p>
          </div>
        </Card>
      </div>

      {/* Transaction History Table */}
      <Card className="overflow-hidden p-0 border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">
            Lịch sử giao dịch gần đây (Webhooks Real-time)
          </h2>
          <Badge variant="success" size="sm" icon={CheckCircle2}>
            PayOS Connected
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã đơn</th>
                <th className="py-3.5 px-4">Khách hàng</th>
                <th className="py-3.5 px-4">Khóa học đăng ký</th>
                <th className="py-3.5 px-4">Số tiền</th>
                <th className="py-3.5 px-4">Phương thức</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">
                    {tx.orderCode}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {tx.studentName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 text-xs max-w-xs truncate">
                    {tx.courseTitle}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      Đã thanh toán
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {tx.paidAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RevenueReportView;
