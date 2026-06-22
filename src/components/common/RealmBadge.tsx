interface RealmBadgeProps {
  text: string;
  className?: string;
}

export function RealmBadge({ text, className = '' }: RealmBadgeProps) {
  return <span className={`realm-badge ${className}`}>{text}</span>;
}
