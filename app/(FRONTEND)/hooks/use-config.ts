import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export enum Theme {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Yellow = "yellow",
  Zinc = "zinc",
  Slate = "slate",
  Rose = "rose",
  Orange = "orange",
}

type Config = {
  theme: Theme;
  radius: number;
};

const configAtom = atomWithStorage<Config>("config", {
  theme: Theme.Blue,
  radius: 0.5,
});

export function useConfig() {
  return useAtom(configAtom);
}
