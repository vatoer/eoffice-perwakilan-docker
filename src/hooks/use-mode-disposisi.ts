import { create } from "zustand";

interface ModeDisposisi {
  modeDisposisi: "C" | "R" | "U" | "D" | "NA";
  setModeDisposisi: (modeDisposisi: "C" | "R" | "U" | "D" | "NA") => void;
}

export const useModeDisposisi = create<ModeDisposisi>((set) => ({
  modeDisposisi: "NA",
  setModeDisposisi: (modeDisposisi) => set({ modeDisposisi }),
}));
