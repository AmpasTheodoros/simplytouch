"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Property {
  id: string;
  name: string;
  address: string | null;
}

interface PropertyContextType {
  selectedPropertyId: string | null;
  selectedProperty: Property | null;
  properties: Property[];
  setSelectedPropertyId: (id: string) => void;
  setProperties: (properties: Property[]) => void;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const PROPERTY_STORAGE_KEY = "simplytouch-selected-property";

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [selectedPropertyId, setSelectedPropertyIdState] = useState<string | null>(null);
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load stored property ID on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(PROPERTY_STORAGE_KEY);
    if (stored) {
      setSelectedPropertyIdState(stored);
    }
    setIsLoading(false);
  }, []);

  // When properties are loaded, validate the selected property
  useEffect(() => {
    if (properties.length > 0 && mounted) {
      // If no selection or selected property doesn't exist, select first
      if (!selectedPropertyId || !properties.find(p => p.id === selectedPropertyId)) {
        const firstPropertyId = properties[0].id;
        setSelectedPropertyIdState(firstPropertyId);
        localStorage.setItem(PROPERTY_STORAGE_KEY, firstPropertyId);
      }
    }
  }, [properties, selectedPropertyId, mounted]);

  const setSelectedPropertyId = useCallback((id: string) => {
    setSelectedPropertyIdState(id);
    localStorage.setItem(PROPERTY_STORAGE_KEY, id);
  }, []);

  const setProperties = useCallback((props: Property[]) => {
    setPropertiesState(props);
  }, []);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || null;

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <PropertyContext.Provider
        value={{
          selectedPropertyId: null,
          selectedProperty: null,
          properties: [],
          setSelectedPropertyId,
          setProperties,
          isLoading: true,
        }}
      >
        {children}
      </PropertyContext.Provider>
    );
  }

  return (
    <PropertyContext.Provider
      value={{
        selectedPropertyId,
        selectedProperty,
        properties,
        setSelectedPropertyId,
        setProperties,
        isLoading,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
}
