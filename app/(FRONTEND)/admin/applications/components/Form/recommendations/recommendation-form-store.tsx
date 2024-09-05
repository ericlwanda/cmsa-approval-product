import { IRecommendation } from "@/types/user";
import { create } from "zustand";
interface UseRecommendationFormState {
  open: boolean;
  create: () => void;
  edit: (value: IRecommendation) => void;
  editingRecommendation: IRecommendation | null;
  close: () => void;
  view: (value: IRecommendation) => void;
  viewing: boolean;
}
export const useRecommendationFormStore = create<UseRecommendationFormState>((set) => ({
  open: false,
  viewing: false,
  editingRecommendation: null,
  create: () => set((_) => ({ open: true, editingRecommendation: null, viewing: false })),
  edit: (value: IRecommendation) =>
    set((_) => ({ open: true, editingRecommendation: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingRecommendation: null })),
  view: (value: IRecommendation) =>
    set((_) => ({ open: true, editingRecommendation: value, viewing: true })),
}));
