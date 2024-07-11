import { create } from "zustand";

type DatePickerState = {
  dt: Date | null;
  setDate: (dt: Date | undefined) => void;
};

export const useDatePicker = create<DatePickerState>((set) => ({
  dt: null,
  setDate: (dt) => set({ dt }),
}));
