import { create } from "zustand";

interface ISuratId {
  suratId: string | null;
  setSuratId: (suratId: string | null) => void;
}

export const useSuratId = create<ISuratId>((set) => ({
  suratId: null,
  setSuratId: (suratId) => set({ suratId }),
}));
