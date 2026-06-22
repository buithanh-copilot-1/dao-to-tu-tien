export type CurrencyType = 'crystal' | 'gold' | 'jade';

interface CurrencyItemProps {
  type: CurrencyType;
  amount: string;
  onAdd?: () => void;
}

const CURRENCY_ICONS: Record<CurrencyType, string> = {
  crystal: '💎',
  gold: '🪙',
  jade: '🟢',
};

export function CurrencyItem({ type, amount, onAdd }: CurrencyItemProps) {
  return (
    <div className="currency-item">
      <span className={`currency-item__icon currency-item__icon--${type}`}>
        {CURRENCY_ICONS[type]}
      </span>
      <span className="currency-item__amount">{amount}</span>
      {onAdd && (
        <button className="currency-item__add" onClick={onAdd} type="button">
          +
        </button>
      )}
    </div>
  );
}

interface CurrencyBarProps {
  currencies: { type: CurrencyType; amount: string }[];
  onAdd?: (type: CurrencyType) => void;
}

export function CurrencyBar({ currencies, onAdd }: CurrencyBarProps) {
  return (
    <div className="currency-bar">
      {currencies.map((c) => (
        <CurrencyItem
          key={c.type}
          type={c.type}
          amount={c.amount}
          onAdd={onAdd ? () => onAdd(c.type) : undefined}
        />
      ))}
    </div>
  );
}
