import { useLocation, useNavigate } from 'react-router-dom';
import { GameButton } from '@/components';
import { getGroupedItemAcquisitionSources } from '@/data/itemSources';
import type { ItemAcquisitionSource } from '@/data/itemSources';

interface ItemSourcePanelProps {
  templateId: string;
  onNavigate?: () => void;
}

function SourceList({
  sources,
  currentPath,
  pathname,
  onGo,
}: {
  sources: ItemAcquisitionSource[];
  currentPath: string;
  pathname: string;
  onGo: (route: string) => void;
}) {
  return (
    <>
      {sources.map((source) => {
        const isHere = currentPath === source.route || pathname === source.route.split('?')[0];
        return (
          <div key={source.id} className="item-sources__row">
            <div className="item-sources__info">
              <div className="item-sources__title">{source.title}</div>
              <div className="item-sources__desc">{source.description}</div>
            </div>
            <GameButton
              variant="secondary"
              className="item-sources__btn"
              disabled={isHere}
              onClick={() => onGo(source.route)}
            >
              {isHere ? 'Đang ở đây' : source.buttonLabel}
            </GameButton>
          </div>
        );
      })}
    </>
  );
}

export function ItemSourcePanel({ templateId, onNavigate }: ItemSourcePanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { primary, secondary } = getGroupedItemAcquisitionSources(templateId);
  const currentPath = `${location.pathname}${location.search}`;

  const handleGo = (route: string) => {
    onNavigate?.();
    const [path, search] = route.split('?');
    navigate({ pathname: path, search: search ? `?${search}` : '' });
  };

  return (
    <div className="item-sources">
      <div className="item-sources__head">Cách nhận</div>
      <div className="item-sources__list">
        {primary.length > 0 && (
          <>
            {primary.length > 0 && secondary.length > 0 && (
              <div className="item-sources__group-label">Nguồn chính</div>
            )}
            <SourceList
              sources={primary}
              currentPath={currentPath}
              pathname={location.pathname}
              onGo={handleGo}
            />
          </>
        )}
        {secondary.length > 0 && (
          <>
            <div className="item-sources__group-label">Có thể rơi thêm</div>
            <SourceList
              sources={secondary}
              currentPath={currentPath}
              pathname={location.pathname}
              onGo={handleGo}
            />
          </>
        )}
      </div>
    </div>
  );
}
