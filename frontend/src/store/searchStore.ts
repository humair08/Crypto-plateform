import { create } from 'zustand';

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (q: string) => set({ searchQuery: q }),
}));
