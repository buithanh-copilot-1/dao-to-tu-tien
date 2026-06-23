import { AncientIcon, type AncientIconName } from '../common/AncientIcon';
import { NotifyDot } from '../common/NotifyDot';
import type { MenuIconTone } from './SideMenu';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: AncientIconName;
  tone?: MenuIconTone;
  notify?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

const TONE_CLASS: Record<MenuIconTone, string> = {
  gold: 'anc-icon--gold',
  crystal: 'anc-icon--crystal',
  jade: 'anc-icon--jade',
  power: 'anc-icon--power',
  cinnabar: 'anc-icon--cinnabar',
};

export function BottomNav({ items, activeId, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const tone = item.tone ?? 'gold';

        return (
          <button
            key={item.id}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
            onClick={() => onChange(item.id)}
            type="button"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav__icon-wrap">
              <AncientIcon
                name={item.icon}
                size={isActive ? 26 : 22}
                className={TONE_CLASS[tone]}
              />
              {item.notify && <NotifyDot className="bottom-nav__notify" size="sm" />}
            </span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export const DEFAULT_NAV_ITEMS: BottomNavItem[] = [
  { id: 'immortal', label: 'Tiên Vực', icon: 'pagoda', notify: true },
  { id: 'character', label: 'Nhân Vật', icon: 'person' },
  { id: 'inventory', label: 'Túi đồ', icon: 'bag', notify: true },
  { id: 'cultivation', label: 'Tu Luyện', icon: 'meditate', notify: true },
  { id: 'sect', label: 'Tông Môn', icon: 'gate', notify: true },
  { id: 'arena', label: 'Đấu Pháp', icon: 'compass' },
  { id: 'explore', label: 'Thám Hiểm', icon: 'sword' },
];
