import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type RedirectLocationState = {
  from?: string;
};

export function currentPath(pathname: string, search: string): string {
  return `${pathname}${search}`;
}

export function useRedirectBack(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as RedirectLocationState | null)?.from;

  const goBack = useCallback(() => {
    if (from) {
      navigate(from);
      return;
    }
    navigate(fallback);
  }, [from, fallback, navigate]);

  return {
    goBack,
    from,
    showBack: true,
  };
}

export function navigateWithFrom(
  navigate: ReturnType<typeof useNavigate>,
  to: string,
  from: string,
) {
  navigate(to, { state: { from } });
}
