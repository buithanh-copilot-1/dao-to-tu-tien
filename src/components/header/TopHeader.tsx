import { PlayerInfo } from './PlayerInfo';
import { CurrencyBar, type CurrencyType } from './CurrencyBar';
import { BackButton } from '../common/BackButton';
import type { ElementType, Gender } from '@/types/game';

interface TopHeaderProps {
  name: string;
  level: number;
  realm: string;
  combatPower?: string;
  currencies?: { type: CurrencyType; amount: string }[];
  showBack?: boolean;
  onBack?: () => void;
  onCurrencyAdd?: (type: CurrencyType) => void;
  notify?: boolean;
  gender?: Gender;
  element?: ElementType;
}

export function TopHeader({
  name,
  level,
  realm,
  combatPower,
  currencies = [
    { type: 'crystal', amount: '12.34M' },
    { type: 'gold', amount: '8.88M' },
    { type: 'jade', amount: '15.62K' },
  ],
  showBack,
  onBack,
  onCurrencyAdd,
  notify,
  gender,
  element,
}: TopHeaderProps) {
  return (
    <header className="top-header">
      <PlayerInfo
        name={name}
        level={level}
        realm={realm}
        combatPower={combatPower}
        notify={notify}
        gender={gender}
        element={element}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <CurrencyBar currencies={currencies} onAdd={onCurrencyAdd} />
        {showBack && <BackButton onClick={onBack} />}
      </div>
    </header>
  );
}
