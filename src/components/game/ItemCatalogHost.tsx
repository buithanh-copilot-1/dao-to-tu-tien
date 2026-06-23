import { useUiStore } from '@/stores/uiStore';
import { ItemCatalogModal } from '@/components/game/ItemCatalogModal';

export function ItemCatalogHost() {
  const templateId = useUiStore((s) => s.catalogTemplateId);
  const closeItemCatalog = useUiStore((s) => s.closeItemCatalog);

  if (!templateId) return null;

  return (
    <ItemCatalogModal
      templateId={templateId}
      onClose={closeItemCatalog}
    />
  );
}
