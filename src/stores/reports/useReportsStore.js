import { create } from "zustand";

const useReportsStore = create((set) => ({
  reports: [
    { id: 1, name: "Weekly Progress", type: "PDF Summary" },
    { id: 2, name: "Punchlist Detailed", type: "PDF Detailed" },
  ],
  selectedReport: null,
  showEditor: false,

  setReports: (reports) =>
    set({
      reports,
    }),

  setSelectedReport: (report) =>
    set({
      selectedReport: report,
    }),

  setShowEditor: (value) =>
    set({
      showEditor: value,
    }),

  handleDelete: (id) => {
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    }));
  },
}));

export default useReportsStore;
