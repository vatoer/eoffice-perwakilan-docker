import { create } from "zustand";

interface ToggleFormDispo {
  onOff: boolean;
  toggle: () => void;
  setShow: (onOff: boolean) => void;
}

export const useToggleFormDispo = create<ToggleFormDispo>((set) => ({
  onOff: false,
  toggle: () => set((state) => ({ onOff: !state.onOff })),
  setShow: (onOff) => set({ onOff }),
}));
