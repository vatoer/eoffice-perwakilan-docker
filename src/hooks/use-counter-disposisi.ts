import { create } from "zustand";

interface CounterDisposisi {
  count: number;
  setCounter: (count: number) => void;
}

export const useCounterDisposisi = create<CounterDisposisi>((set) => ({
  count: 0,
  setCounter: (count) => set({ count }),
}));
