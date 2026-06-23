import type { ReactNode } from 'react';
import { AncientIcon, type AncientIconName } from './AncientIcon';

export interface ModalAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
  icon?: AncientIconName;
}

export interface ModalProps {
  title?: string;
  icon?: AncientIconName;
  children: ReactNode;
  footer?: ReactNode;
  actions?: ModalAction[];
  size?: 'sm' | 'md' | 'lg';
  type?: 'info' | 'confirm' | 'menu' | 'detail';
  onClose?: () => void;
  panelClassName?: string;
}

const SIZE_CLASS: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'ancient-modal__panel--sm',
  md: 'ancient-modal__panel--md',
  lg: 'ancient-modal__panel--lg',
};

const TYPE_CLASS: Record<NonNullable<ModalProps['type']>, string> = {
  info: 'ancient-modal__panel--info',
  confirm: 'ancient-modal__panel--confirm',
  menu: 'ancient-modal__panel--menu',
  detail: 'ancient-modal__panel--detail',
};

export function AncientModal({
  title,
  icon,
  children,
  footer,
  actions,
  size = 'md',
  type = 'info',
  onClose,
  panelClassName,
}: ModalProps) {
  const hasFooter = Boolean(footer) || Boolean(actions && actions.length > 0);

  return (
    <div className="ancient-modal" onClick={onClose}>
      <div
        className={[
          'ancient-modal__panel',
          SIZE_CLASS[size],
          TYPE_CLASS[type],
          panelClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || icon || onClose) && (
          <div className="ancient-modal__header">
            <div className="ancient-modal__header-icon" aria-hidden>
              <AncientIcon name={icon ?? 'realm'} size={16} />
            </div>
            <div className="ancient-modal__title">{title ?? 'Thiên Cơ Các'}</div>
            <div className="ancient-modal__header-icon" aria-hidden>
              <AncientIcon name={icon ?? 'realm'} size={16} />
            </div>
            {onClose && (
              <button type="button" className="ancient-modal__close" onClick={onClose} aria-label="Đóng">
                <AncientIcon name="close" size={14} />
              </button>
            )}
          </div>
        )}

        <div className="ancient-modal__body">{children}</div>

        {hasFooter && (
          <div className="ancient-modal__footer">
            {footer ??
              actions?.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={`ancient-modal__action ancient-modal__action--${action.variant ?? 'primary'}`}
                  onClick={action.onClick}
                >
                  {action.icon && <AncientIcon name={action.icon} size={14} />}
                  <span>{action.label}</span>
                </button>
              ))}
          </div>
        )}

        <span className="ancient-modal__corner ancient-modal__corner--tl" aria-hidden />
        <span className="ancient-modal__corner ancient-modal__corner--tr" aria-hidden />
        <span className="ancient-modal__corner ancient-modal__corner--bl" aria-hidden />
        <span className="ancient-modal__corner ancient-modal__corner--br" aria-hidden />
      </div>
    </div>
  );
}
