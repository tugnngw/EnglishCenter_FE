/** Format số VND: 3490000 → "3.490.000 ₫" */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrency = formatVND;

/** Format số có dấu phân cách hàng nghìn */
export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("vi-VN").format(n);

/** Định dạng ngày kiểu Việt Nam dd/MM/yyyy */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/** Đếm số từ trong chuỗi */
export const countWords = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

/** Ngày giờ kiểu Việt Nam: "24/10/2026 14:05". */
export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Số giây thành "mm:ss" hoặc "h:mm:ss". */
export const formatDuration = (totalSeconds: number): string => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
