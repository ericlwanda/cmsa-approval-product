import { IUser } from "@/types/user";
import { create } from "zustand";
interface UseUserFormState {
  open: boolean;
  create: () => void;
  edit: (value: IUser) => void;
  editingUser: IUser | null;
  close: () => void;
  view: (value: IUser) => void;
  viewing: boolean;
}
export const useUserFormStore = create<UseUserFormState>((set) => ({
  open: false,
  viewing: false,
  editingUser: null,
  create: () => set((_) => ({ open: true, editingUser: null, viewing: false })),
  edit: (value: IUser) =>
    set((_) => ({ open: true, editingUser: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingUser: null })),
  view: (value: IUser) =>
    set((_) => ({ open: true, editingUser: value, viewing: true })),
}));
