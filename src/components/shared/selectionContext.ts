import { createContext, useContext } from "react";

export type SelectionLayout = "list" | "horizontal" | "pill" | "scale";

export type SelectionContextValue = {
  selectedValues: string[];
  onSelect: (value: string) => void;
  isMultiple: boolean;
  disabled: boolean;
  groupName: string;
  layout: SelectionLayout;
  hasError: boolean;
};

export const SelectionContext = createContext<SelectionContextValue | null>(null);

export const useSelection = () => useContext(SelectionContext);
