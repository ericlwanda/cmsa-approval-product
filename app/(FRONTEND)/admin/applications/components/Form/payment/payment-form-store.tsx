import { IPayment } from "@/types/user";
import { create } from "zustand";
interface UsePaymentFormState {
  open: boolean;
  create: () => void;
  edit: (value: IPayment) => void;
  editingPayment: IPayment | null;
  close: () => void;
  view: (value: IPayment) => void;
  viewing: boolean;
}
export const usePaymentFormStore = create<UsePaymentFormState>((set) => ({
  open: false,
  viewing: false,
  editingPayment: null,
  create: () => set((_) => ({ open: true, editingPayment: null, viewing: false })),
  edit: (value: IPayment) =>
    set((_) => ({ open: true, editingPayment: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingPayment: null })),
  view: (value: IPayment) =>
    set((_) => ({ open: true, editingPayment: value, viewing: true })),
}));
