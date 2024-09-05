import { IControlNumber } from "@/types/user";
import { create } from "zustand";
interface UsePaymentFormState {
  open: boolean;
  create: () => void;
  close: () => void;
}
export const usePaymentFormStore = create<UsePaymentFormState>((set) => ({
  open: false,
  create: () => set((_) => ({ open: true, editingPayment: null, viewing: false })),
  close: () => set((_) => ({ open: false, editingPayment: null })),

}));
