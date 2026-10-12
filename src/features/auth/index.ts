/**
 * Auth feature — barrel export
 * -----------------------------------------------------------
 * Sau khi tái cấu trúc, feature chỉ còn components/ + hooks/.
 * Types, services, stores đã chuyển ra package ngoài.
 *
 * Import ngoài feature (khuyến nghị):
 *   import { useAuthStore, ROLE_MOCK_PROFILE } from '@/stores';
 *   import type { UserRole } from '@/interfaces';
 *   import { loginApi } from '@/services';
 *
 * Tuy nhiên, để tránh phá vỡ quá nhiều file hiện tại, barrel này
 * cũng re-export useAuthStore + ROLE_MOCK_PROFILE từ @/stores.
 * Dần dần các page/layout có thể chuyển sang import trực tiếp từ @/stores.
 */

export { useAuthStore, ROLE_MOCK_PROFILE } from '@/stores';
export type { UserRole } from '@/interfaces';
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
export { useAuth, useRole, useIsAuthenticated } from './hooks/useAuth';
