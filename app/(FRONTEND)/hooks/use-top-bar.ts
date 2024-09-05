import { create } from "zustand";
interface State {
  topBarRef: HTMLDivElement | null;
  setTopBarRef: (ref: HTMLDivElement) => void;
}
export const useTobBarStore = create<State>((set) => ({
  topBarRef: null,
  setTopBarRef: (ref: HTMLDivElement) => set((_) => ({ topBarRef: ref })),
}));
 