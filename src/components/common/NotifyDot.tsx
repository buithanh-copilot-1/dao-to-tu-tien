interface NotifyDotProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function NotifyDot({ className = '', size = 'md' }: NotifyDotProps) {
  return <span className={`notify-dot ${size === 'sm' ? 'notify-dot--sm' : ''} ${className}`} />;
}
