import axios from "axios";
import { env } from "@/shared/config/env";
import { setupInterceptors } from "./interceptors";

/**
 * axiosClient — MUST mọi request đi qua đây.
 * Không dùng fetch() hoặc axios.create() riêng.
 */
export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

setupInterceptors(axiosClient);
