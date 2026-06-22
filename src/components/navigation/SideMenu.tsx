import { NotifyDot } from '../common/NotifyDot';

interface SideMenuItem {
  id: string;
  label: string;
  icon: string;
  notify?: boolean;
  timer?: string;
}

interface SideMenuProps {
  items: SideMenuItem[];
  position: 'left' | 'right';
  onItemClick?: (id: string) => void;
}

export function SideMenu({ items, position, onItemClick }: SideMenuProps) {
  return (
    <div className={`side-menu side-menu--${position}`}>
      {items.map((item) => (
        <button
          key={item.id}
          className="side-menu__item"
          onClick={() => onItemClick?.(item.id)}
          type="button"
        >
          <div className="side-menu__icon-wrap">
            <span>{item.icon}</span>
            {item.notify && <NotifyDot className="side-menu__notify" size="sm" />}
          </div>
          <span className="side-menu__label">{item.label}</span>
          {item.timer && <span className="side-menu__timer">{item.timer}</span>}
        </button>
      ))}
    </div>
  );
}

export const LEFT_MENU_ITEMS: SideMenuItem[] = [
  { id: 'first-charge', label: 'Nạp Đầu', icon: '📜' },
  { id: 'benefits', label: 'Phúc Lợi', icon: '🎁', notify: true },
  { id: 'month-card', label: 'Thẻ Tháng', icon: '📅' },
  { id: 'growth-fund', label: 'Quỹ Trưởng Thành', icon: '🏆' },
  { id: 'ranking', label: 'Xếp Hạng', icon: '🧭' },
];

export const RIGHT_MENU_ITEMS: SideMenuItem[] = [
  { id: 'events', label: 'Sự Kiện', icon: '🎉', notify: true },
  { id: '7day', label: 'Phúc Lợi 7 Ngày', icon: '🎀', timer: '06:23:45' },
  { id: 'heaven', label: 'Tháp Thí Luyện', icon: '🗼', notify: true, timer: '02:13:26' },
  { id: 'arena', label: 'Đấu Pháp Đài', icon: '⚔️', notify: true, timer: '01:45:12' },
  { id: 'sect-war', label: 'Tông Môn Chiến', icon: '🏯', timer: '1 ngày 08:23' },
  { id: 'secret', label: 'Bí Cảnh', icon: '✨', notify: true },
];
