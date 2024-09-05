import { IComment } from "@/types/user";
import { create } from "zustand";
interface UseCommentFormState {
  open: boolean;
  create: () => void;
  edit: (value: IComment) => void;
  editingComment: IComment | null;
  close: () => void;
  view: (value: IComment) => void;
  viewing: boolean;
}
export const useCommentFormStore = create<UseCommentFormState>((set) => ({
  open: false,
  viewing: false,
  editingComment: null,
  create: () => set((_) => ({ open: true, editingComment: null, viewing: false })),
  edit: (value: IComment) =>
    set((_) => ({ open: true, editingComment: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingComment: null })),
  view: (value: IComment) =>
    set((_) => ({ open: true, editingComment: value, viewing: true })),
}));
