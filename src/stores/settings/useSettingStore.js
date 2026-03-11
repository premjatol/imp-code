import { create } from "zustand";

const useSettingStore = create((set) => ({
  open: false,
  selectedCategory: null,
  selectedGroup: null,

  setSelectedCategory: (value) =>
    set({
      selectedCategory: value,
    }),

  setSelectedGroup: (value) => set({ selectedGroup: value }),

  setOpen: (value) =>
    set({
      open: value,
    }),
}));

export default useSettingStore;
