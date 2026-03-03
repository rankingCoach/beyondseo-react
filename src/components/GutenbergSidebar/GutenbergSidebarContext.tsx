import React, { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { DEFAULT_EXPANDED_CATEGORIES, DEFAULT_EXPANDED_CONTENT_ITEMS } from "./GutenbergSidebarHelpers";

// Context type definition
export type SidebarContextType = {
  expandedContentItems: { [key: string]: boolean };
  setExpandedContentItems: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  expandedCategories: { [key: string]: boolean };
  setExpandedCategories: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
};

// Create a context to store persistent state
const GutenbergSidebarContext = createContext<SidebarContextType | null>(null);

// Create a persistent state provider component
export const GutenbergSidebarStateProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with default values
  const [expandedContentItems, setExpandedContentItems] = useState<{ [key: string]: boolean }>(
    DEFAULT_EXPANDED_CONTENT_ITEMS,
  );

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>(DEFAULT_EXPANDED_CATEGORIES);

  // Provide state to children
  return (
    <GutenbergSidebarContext.Provider
      value={{
        expandedContentItems,
        setExpandedContentItems,
        expandedCategories,
        setExpandedCategories,
      }}
    >
      {children}
    </GutenbergSidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useGutenbergSidebarState = () => {
  const context = useContext(GutenbergSidebarContext);
  if (!context) {
    throw new Error("useGutenbergSidebarState must be used within a GutenbergSidebarStateProvider");
  }
  return context;
};
