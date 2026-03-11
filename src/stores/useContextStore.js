import { create } from "zustand";

const DEFAULT_PARAMS = "?page=1&limit=10";

const useContextStore = create((set, get) => ({
  isCollapsed: false,
  paramsStr: DEFAULT_PARAMS,
  currentModule: null,

  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),

  setIsCollapsed: (value) =>
    set({
      isCollapsed: value,
    }),

  createParamsStr: (paramsObject = {}, moduleKey = null) => {
    if (moduleKey === null) {
      throw new Error("ModuleKey is required.");
    }
    const { currentModule, paramsStr } = get();

    let baseParamsStr = paramsStr;

    if (currentModule !== moduleKey) {
      baseParamsStr = DEFAULT_PARAMS;
      set({ currentModule: moduleKey });
    }

    const searchParams = new URLSearchParams(baseParamsStr);

    Object.entries(paramsObject).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });

    const finalString = `?${searchParams.toString()}`;

    set({ paramsStr: finalString });

    return finalString;
  },

  resetParams: () =>
    set({
      paramsStr: DEFAULT_PARAMS,
    }),
}));

export default useContextStore;
