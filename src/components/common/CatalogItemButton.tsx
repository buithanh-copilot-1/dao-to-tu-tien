import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { useUiStore } from '@/stores/uiStore';

interface CatalogItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  templateId: string;
  children: ReactNode;
}

export function CatalogItemButton({
  templateId,
  children,
  className,
  type = 'button',
  onClick,
  ...props
}: CatalogItemButtonProps) {
  const openItemCatalog = useUiStore((s) => s.openItemCatalog);

  return (
    <button
      type={type}
      className={className}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) openItemCatalog(templateId);
      }}
    >
      {children}
    </button>
  );
}
