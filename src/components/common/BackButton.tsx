interface BackButtonProps {
  onClick?: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button className="back-btn" onClick={onClick} type="button" aria-label="Quay lại">
      ‹
    </button>
  );
}
