import { create } from 'zustand';

interface UiStore {
  catalogTemplateId: string | null;
  openItemCatalog: (templateId: string) => void;
  closeItemCatalog: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  catalogTemplateId: null,
  openItemCatalog: (templateId) => set({ catalogTemplateId: templateId }),
  closeItemCatalog: () => set({ catalogTemplateId: null }),
}));
