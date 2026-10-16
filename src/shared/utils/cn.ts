import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — kết hợp clsx + tailwind-merge.
 * MUST shared/components/ không gọi API, chỉ nhận data qua props.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
