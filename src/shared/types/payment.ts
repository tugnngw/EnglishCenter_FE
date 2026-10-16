import type { ApiResponse } from "./api";

export type PayOSStatus = "PENDING" | "PAID" | "CANCELLED" | "EXPIRED";

export interface PayOSPaymentData {
  orderCode: number;
  amount: number;
  description: string;
  accountNumber: string;
  accountName: string;
  bin: string;
  bankName: string;
  qrCode: string;
  paymentLinkId: string;
  status: PayOSStatus;
  expiredAt: string;
  checkoutUrl?: string;
}

export interface PayOSTransaction extends PayOSPaymentData {
  internalOrderId: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  createdAt: string;
  paidAt?: string;
  confirmationCode?: string;
  enrollmentId?: string;
}

export type CreatePayOSOrderRequest = {
  courseId: string;
  courseTitle: string;
  amount: number;
};

export type CreatePayOSOrderResponse = ApiResponse<PayOSPaymentData>;

export type SimulatePayOSWebhookRequest = {
  orderCode: number;
  status?: PayOSStatus;
};

export type SimulatePayOSWebhookResponse = ApiResponse<{
  transaction: PayOSTransaction;
  confirmationCode: string;
  enrollmentId: string;
}>;

export type GetPayOSOrderResponse = ApiResponse<PayOSTransaction>;

export const PAYOS_HOLD_MINUTES = 15;
export const PAYOS_BANK_BIN = {
  VIETINBANK: "970415",
  MB_BANK: "970422",
} as const;
export const PAYOS_BANK_NAME: Record<string, string> = {
  "970415": "VietinBank",
  "970422": "MB Bank",
};
export const PAYOS_RECEIVER_ACCOUNT = "0000123456789";
export const PAYOS_RECEIVER_NAME = "CONG TY CP CONG NGHE PREPMASTER AI";
