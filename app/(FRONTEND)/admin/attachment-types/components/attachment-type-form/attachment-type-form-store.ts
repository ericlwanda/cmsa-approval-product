import { IAttachmentType } from "@/types/user";
import { create } from "zustand";
interface UseAttachmentTypeFormState {
  open: boolean;
  create: () => void;
  edit: (value: IAttachmentType) => void;
  editingAttachmentType: IAttachmentType | null;
  close: () => void;
  view: (value: IAttachmentType) => void;
  viewing: boolean;
}
export const useAttachmentTypeFormStore = create<UseAttachmentTypeFormState>((set) => ({
  open: false,
  viewing: false,
  editingAttachmentType: null,
  create: () => set((_) => ({ open: true, editingAttachmentType: null, viewing: false })),
  edit: (value: IAttachmentType) =>
    set((_) => ({ open: true, editingAttachmentType: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingAttachmentType: null })),
  view: (value: IAttachmentType) =>
    set((_) => ({ open: true, editingAttachmentType: value, viewing: true })),
}));
