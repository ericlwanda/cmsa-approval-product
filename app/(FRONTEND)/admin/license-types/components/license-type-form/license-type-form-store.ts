import { ILicenseType } from "@/types/user";
import { create } from "zustand";
interface UseLicenseTypeFormState {
  open: boolean;
  create: () => void;
  edit: (value: ILicenseType) => void;
  editingLicenseType: ILicenseType | null;
  close: () => void;
  view: (value: ILicenseType) => void;
  viewing: boolean;
}
export const useLicenseTypeFormStore = create<UseLicenseTypeFormState>((set) => ({
  open: false,
  viewing: false,
  editingLicenseType: null,
  create: () => set((_) => ({ open: true, editingLicenseType: null, viewing: false })),
  edit: (value: ILicenseType) =>
    set((_) => ({ open: true, editingLicenseType: value, viewing: false })),
  close: () => set((_) => ({ open: false, editingLicenseType: null })),
  view: (value: ILicenseType) =>
    set((_) => ({ open: true, editingLicenseType: value, viewing: true })),
}));
