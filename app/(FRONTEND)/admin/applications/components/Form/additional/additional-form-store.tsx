import { IAdditionals } from "@/types/user";
import { create } from "zustand";
interface UseAdditionalFormState {
  open: boolean;
  create: () => void;
  edit: (value: IAdditionals) => void;
  editingAdditional: IAdditionals | null;
  close: () => void;
  view: (value: IAdditionals) => void;
  viewing: boolean;
}
export const useAdditionalFormStore = create<UseAdditionalFormState>((set) => ({
  open: false,
  viewing: false,
  editingAdditional: null,
  create: () => set((_) => ({ open: true, editingAdditional: null, viewing: false })),
  edit: (value: IAdditionals) =>
    set((_) => ({ open: true, editingAdditional: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingAdditional: null })),
  view: (value: IAdditionals) =>
    set((_) => ({ open: true, editingAdditional: value, viewing: true })),
}));
