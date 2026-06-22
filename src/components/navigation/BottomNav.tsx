import { NotifyDot } from '../common/NotifyDot';

interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  notify?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function BottomNav({ items, activeId, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <div className="bottom-nav__icon-wrap">
              <span className="bottom-nav__icon">{item.icon}</span>
              {item.notify && <NotifyDot className="bottom-nav__notify" size="sm" />}
            </div>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export const DEFAULT_NAV_ITEMS: BottomNavItem[] = [
  { id: 'character', label: 'Nhân vật', icon: '👤', notify: true },
  { id: 'inventory', label: 'Túi đồ', icon: '🎒', notify: true },
  { id: 'cultivation', label: 'Tu luyện', icon: '🧘' },
  { id: 'sect', label: 'Tông môn', icon: '🏯', notify: true },
  { id: 'immortal', label: 'Tiên giới', icon: '⛰️', notify: true },
];
