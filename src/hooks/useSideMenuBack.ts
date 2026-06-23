import { useRedirectBack } from '@/hooks/useRedirectBack';

/** Nút back cho màn mở từ menu phụ — mặc định về Tu luyện. */
export function useSideMenuBack() {
  return useRedirectBack('/home');
}
