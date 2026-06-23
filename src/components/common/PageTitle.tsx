import { AncientIcon } from './AncientIcon';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  showOrnament?: boolean;
}

export function PageTitle({ title, subtitle, showOrnament = true }: PageTitleProps) {
  return (
    <div className="page-title">
      <h1 className="page-title__text glow-gold">
        <span className="page-title__bracket">『</span>
        {title}
        <span className="page-title__bracket">』</span>
      </h1>
      {subtitle && <p className="page-title__subtitle">{subtitle}</p>}
      {showOrnament && (
        <div className="page-title__ornament">
          <AncientIcon name="realm" size={12} className="page-title__ornament-icon" />
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ text }: { text: string }) {
  return (
    <div className="section-header">
      <span className="section-header__diamond">◈</span>
      <span className="section-header__text">{text}</span>
      <span className="section-header__diamond">◈</span>
    </div>
  );
}
