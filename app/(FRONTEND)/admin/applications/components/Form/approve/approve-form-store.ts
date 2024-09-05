import { IReport } from "@/types/user";
import { create } from "zustand";
interface UseApproveFormState {
  open: boolean;
  create: () => void;
}
export const UseApproveFormStore = create<UseApproveFormState>((set) => ({
  open: false,
  create: () =>
    set((_) => ({ open: true, editingReport: null, viewing: false })),
}));
