import { useContext } from "react";
import { SharedContext } from "../providers/layout-provider";

export const useSharedData = () => {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useSharedData must be used within a SharedProvider");
  }
  return context;
};
