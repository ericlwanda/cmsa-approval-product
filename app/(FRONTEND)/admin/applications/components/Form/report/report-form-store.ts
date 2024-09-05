import { IReport } from "@/types/user";
import { create } from "zustand";
interface UseReportFormState {
  open: boolean;
  create: () => void;
}
export const UseReportFormStore = create<UseReportFormState>((set) => ({
  open: false,
  create: () =>
    set((_) => ({ open: true, editingReport: null, viewing: false })),
}));
