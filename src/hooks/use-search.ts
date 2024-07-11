import { create } from "zustand";

interface SearchTerm {
  searchTerm: string | null;
  setSearchTerm: (SearchTerm: string) => void;
}

export const useSearchTerm = create<SearchTerm>((set) => ({
  searchTerm: null,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));
