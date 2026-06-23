import { BackButton } from './BackButton';
import { PageTitle } from './PageTitle';

interface PageHeadProps {
  title: string;
  subtitle?: string;
  showOrnament?: boolean;
  onBack?: () => void;
}

export function PageHead({ title, subtitle, showOrnament, onBack }: PageHeadProps) {
  return (
    <div className="page-head">
      {onBack && <BackButton onClick={onBack} />}
      <PageTitle title={title} subtitle={subtitle} showOrnament={showOrnament} />
    </div>
  );
}
