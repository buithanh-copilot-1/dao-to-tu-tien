import { NotifyDot } from './NotifyDot';

interface TabItem {
  id: string;
  label: string;
  notify?: boolean;
}

interface TabBarProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'category' | 'sub';
}

export function TabBar({ tabs, activeId, onChange, variant = 'default' }: TabBarProps) {
  const classMap = {
    default: 'tab-bar',
    category: 'category-tabs',
    sub: 'sub-tabs',
  };
  const itemClassMap = {
    default: 'tab-bar__item',
    category: 'category-tabs__item',
    sub: 'sub-tabs__item',
  };

  return (
    <div className={classMap[variant]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            className={`${itemClassMap[variant]} ${isActive ? `${itemClassMap[variant]}--active` : ''}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
            {tab.notify && <NotifyDot className="tab-bar__notify" size="sm" />}
          </button>
        );
      })}
    </div>
  );
}
