import { Application } from "@/types/user";
import { create } from "zustand";
interface UseApplicationsFormState {
  open: boolean;
  create: () => void;
  edit: (value: Application) => void;
  editingApplication: Application | null;
  close: () => void;
  view: (value: Application) => void;
  viewing: boolean;
}
export const UseApplicationsFormStore = create<UseApplicationsFormState>((set) => ({
  open: false,
  viewing: false,
  editingApplication: null,
  create: () =>
    set((_) => ({ open: true, editingApplication: null, viewing: false })),
  edit: (value: Application) =>
    set((_) => ({ open: true, editingApplication: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingApplication: null })),
  view: (value: Application) =>
    set((_) => ({ open: true, editingApplication: value, viewing: true })),
}));
