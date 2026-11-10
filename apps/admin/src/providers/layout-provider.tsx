import React, { createContext, useContext, useState, ReactNode } from "react";

interface SharedContextType {
  data: any | null;
  setData: (data: any | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SharedContext = createContext<SharedContextType | undefined>(
  undefined
);

export const SharedLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SharedContext.Provider value={{ data, setData, isLoading, setIsLoading }}>
      {children}
    </SharedContext.Provider>
  );
};
