import { IAttachment } from "@/types/user";
import { create } from "zustand";
interface UseAttachementsFormState {
  open: boolean;
  create: () => void;
  edit: (value: IAttachment) => void;
  editingAttachment: IAttachment | null;
  close: () => void;
  view: (value: IAttachment) => void;
  viewing: boolean;
}
export const UseAttachmentsFormStore = create<UseAttachementsFormState>((set) => ({
  open: false,
  viewing: false,
  editingAttachment: null,
  create: () =>
    set((_) => ({ open: true, editingAttachment: null, viewing: false })),
  edit: (value: IAttachment) =>
    set((_) => ({ open: true, editingAttachment: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingAttachment: null })),
  view: (value: IAttachment) =>
    set((_) => ({ open: true, editingAttachment: value, viewing: true })),
}));
