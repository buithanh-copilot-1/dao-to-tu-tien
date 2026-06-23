import { AncientIcon, type AncientIconName } from '../common/AncientIcon';
import { NotifyDot } from '../common/NotifyDot';

export type MenuIconTone = 'gold' | 'crystal' | 'jade' | 'power' | 'cinnabar';

export interface SideMenuItem {
  id: string;
  label: string;
  icon: AncientIconName;
  tone?: MenuIconTone;
  notify?: boolean;
  timer?: string;
}

interface SideMenuProps {
  items: SideMenuItem[];
  position: 'left' | 'right';
  collapsed?: boolean;
  onToggle?: () => void;
  onItemClick?: (id: string) => void;
}

const TONE_CLASS: Record<MenuIconTone, string> = {
  gold: 'anc-icon--gold',
  crystal: 'anc-icon--crystal',
  jade: 'anc-icon--jade',
  power: 'anc-icon--power',
  cinnabar: 'anc-icon--cinnabar',
};

export function SideMenu({ items, position, collapsed = false, onToggle, onItemClick }: SideMenuProps) {
  const menuLabel = position === 'left' ? 'trái' : 'phải';
  const toggleIcon = collapsed ? (position === 'left' ? '»' : '«') : position === 'left' ? '«' : '»';

  return (
    <div className={`side-menu side-menu--${position} ${collapsed ? 'side-menu--collapsed' : ''}`}>
      <button
        type="button"
        className="side-menu__toggle"
        onClick={onToggle}
        aria-label={`${collapsed ? 'Mở' : 'Thu gọn'} menu ${menuLabel}`}
        aria-expanded={!collapsed}
      >
        <span className="side-menu__toggle-icon" aria-hidden="true">{toggleIcon}</span>
      </button>
      {items.map((item) => (
        <button
          key={item.id}
          className="side-menu__item"
          onClick={() => onItemClick?.(item.id)}
          type="button"
          aria-label={item.label}
        >
          <div className={`side-menu__icon-wrap ${item.tone ? `side-menu__icon-wrap--${item.tone}` : ''}`}>
            <AncientIcon
              name={item.icon}
              size={22}
              className={item.tone ? TONE_CLASS[item.tone] : 'anc-icon--gold'}
            />
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
  { id: 'sect', label: 'Tông Môn', icon: 'gate', tone: 'gold' },
  { id: 'technique', label: 'Công Pháp', icon: 'scroll', tone: 'jade' },
  { id: 'talent', label: 'Thiên Phú', icon: 'realm', tone: 'power' },
  { id: 'alchemy', label: 'Đan Dược', icon: 'gourd', tone: 'cinnabar' },
  { id: 'forge', label: 'Luyện Khí', icon: 'flame', tone: 'crystal' },
  { id: 'ascension', label: 'Phi Thăng', icon: 'sparkle', tone: 'power' },
];

export const RIGHT_MENU_ITEMS: SideMenuItem[] = [
  { id: 'events', label: 'Sự Kiện', icon: 'festival', tone: 'cinnabar', notify: true },
  { id: 'pet', label: 'Linh Thú', icon: 'flame', tone: 'power' },
  { id: 'mount', label: 'Tọa Kỵ', icon: 'meditate', tone: 'jade' },
  { id: 'heaven', label: 'Tháp Thí Luyện', icon: 'pagoda', tone: 'power', notify: true, timer: '02:13:26' },
  { id: 'arena', label: 'Đấu Pháp Đài', icon: 'arena', tone: 'power', notify: true, timer: '01:45:12' },
  { id: 'market', label: 'Phường Thị', icon: 'coin', tone: 'gold' },
  { id: 'secret', label: 'Bí Cảnh', icon: 'realm', tone: 'crystal', notify: true },
  { id: 'settings', label: 'Cài Đặt', icon: 'sort', tone: 'jade' },
];
