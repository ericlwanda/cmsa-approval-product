import { Person } from "@/lib/data/people";
import { create } from "zustand";
interface UseUsersFormState {
  open: boolean;
  create: () => void;
  edit: (value: Person) => void;
  editingUsers: Person | null;
  close: () => void;
  view: (value: Person) => void;
  viewing: boolean;
}
export const UseUsersFormStore = create<UseUsersFormState>((set) => ({
  open: false,
  viewing: false,
  editingUsers: null,
  create: () =>
    set((_) => ({ open: true, editingUsers: null, viewing: false })),
  edit: (value: Person) =>
    set((_) => ({ open: true, editingUsers: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingUsers: null })),
  view: (value: Person) =>
    set((_) => ({ open: true, editingUsers: value, viewing: true })),
}));
