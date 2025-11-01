// store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  data: '',
  setData: (newData) => set({ data: newData }),
}));
