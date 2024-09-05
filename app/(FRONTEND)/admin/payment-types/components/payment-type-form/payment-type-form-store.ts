import { IPaymentType } from "@/types/user";
import { create } from "zustand";
interface UsePaymentTypeFormState {
  open: boolean;
  create: () => void;
  edit: (value: IPaymentType) => void;
  editingPaymentType: IPaymentType | null;
  close: () => void;
  view: (value: IPaymentType) => void;
  viewing: boolean;
}
export const usePaymentTypeFormStore = create<UsePaymentTypeFormState>((set) => ({
  open: false,
  viewing: false,
  editingPaymentType: null,
  create: () => set((_) => ({ open: true, editingPaymentType: null, viewing: false })),
  edit: (value: IPaymentType) =>
    set((_) => ({ open: true, editingPaymentType: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingPaymentType: null })),
  view: (value: IPaymentType) =>
    set((_) => ({ open: true, editingPaymentType: value, viewing: true })),
}));
