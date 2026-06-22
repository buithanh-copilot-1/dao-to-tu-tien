import type { ReactNode } from 'react';

interface PillToggleOption {
  id: string;
  label: string;
  icon?: string;
}

interface PillToggleProps {
  options: PillToggleOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function PillToggle({ options, activeId, onChange }: PillToggleProps) {
  return (
    <div className="pill-toggle">
      {options.map((opt) => (
        <button
          key={opt.id}
          className={`pill-toggle__item ${opt.id === activeId ? 'pill-toggle__item--active' : ''}`}
          onClick={() => onChange(opt.id)}
          type="button"
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface GameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  actionIcon?: string;
  onAction?: () => void;
}

export function GameInput({ value, onChange, placeholder, actionIcon, onAction }: GameInputProps) {
  return (
    <div className="game-input-wrap">
      <input
        className="game-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {actionIcon && (
        <span className="game-input-wrap__action" onClick={onAction} role="button" tabIndex={0}>
          {actionIcon}
        </span>
      )}
    </div>
  );
}

interface GameCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function GameCheckbox({ checked, onChange, label }: GameCheckboxProps) {
  return (
    <label className="game-checkbox" onClick={() => onChange(!checked)}>
      <span className={`game-checkbox__box ${checked ? 'game-checkbox__box--checked' : ''}`}>
        {checked && '✓'}
      </span>
      {label}
    </label>
  );
}

interface CombatPowerProps {
  value: string;
  size?: 'sm' | 'lg';
}

export function CombatPower({ value, size = 'lg' }: CombatPowerProps) {
  return (
    <div className={`combat-power ${size === 'sm' ? 'combat-power--sm' : ''}`}>
      <div className="combat-power__label">Lực Chiến</div>
      <div className="combat-power__value glow-orange">{value}</div>
    </div>
  );
}

interface TimerDisplayProps {
  label: string;
  value: string;
}

export function TimerDisplay({ label, value }: TimerDisplayProps) {
  return (
    <div className="timer-display">
      <div className="timer-display__label">{label}</div>
      <div className="timer-display__value">{value}</div>
    </div>
  );
}

interface ElementOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ElementSelectorProps {
  elements: ElementOption[];
  activeId: string;
  onChange: (id: string) => void;
}

export function ElementSelector({ elements, activeId, onChange }: ElementSelectorProps) {
  return (
    <div className="element-grid">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`element-item ${el.id === activeId ? 'element-item--active' : ''}`}
          onClick={() => onChange(el.id)}
          role="button"
          tabIndex={0}
        >
          <div className="element-item__circle">{el.icon}</div>
          <span className="element-item__name">{el.name}</span>
          <span className="element-item__desc">{el.description}</span>
        </div>
      ))}
    </div>
  );
}

export const DEFAULT_ELEMENTS: ElementOption[] = [
  { id: 'metal', name: 'Kim', icon: '⚔️', description: 'Cứng rắn, sắc bén' },
  { id: 'wood', name: 'Mộc', icon: '🌿', description: 'Sinh sôi, trị liệu' },
  { id: 'water', name: 'Thủy', icon: '💧', description: 'Linh hoạt, khống chế' },
  { id: 'fire', name: 'Hỏa', icon: '🔥', description: 'Bùng nổ, sát thương' },
  { id: 'earth', name: 'Thổ', icon: '⛰️', description: 'Vững chắc, phòng thủ' },
];

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  footer?: ReactNode;
}

export function Modal({ children, onClose, footer }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="modal-panel__close" onClick={onClose} type="button">
            ✕
          </button>
        )}
        <div className="modal-panel__body">{children}</div>
        {footer && <div className="modal-panel__footer">{footer}</div>}
      </div>
    </div>
  );
}
