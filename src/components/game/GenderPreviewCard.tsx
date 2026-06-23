import type { Gender } from '@/types/game';
import previewSelectNam from '@/assets/create/preview_select_nam.png';
import previewSelectNu from '@/assets/create/preview_select_nu.png';

const PREVIEW_CARDS: Record<Gender, string> = {
  male: previewSelectNam,
  female: previewSelectNu,
};

const SELECT_LABEL: Record<Gender, string> = {
  male: 'Chọn Nam',
  female: 'Chọn Nữ',
};

interface GenderPreviewCardProps {
  gender: Gender;
  onSelect: () => void;
}

export function GenderPreviewCard({ gender, onSelect }: GenderPreviewCardProps) {
  return (
    <button
      type="button"
      className={`gender-preview-card gender-preview-card--${gender}`}
      onClick={onSelect}
      aria-label={SELECT_LABEL[gender]}
    >
      <img
        className="gender-preview-card__image"
        src={PREVIEW_CARDS[gender]}
        alt={SELECT_LABEL[gender]}
        draggable={false}
      />
    </button>
  );
}
