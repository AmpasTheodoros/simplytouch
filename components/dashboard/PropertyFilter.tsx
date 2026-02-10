"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Building2, Loader2 } from "lucide-react";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Special value for "all properties"
export const ALL_PROPERTIES = "__all__";

interface PropertyFilterProps {
  value: string; // property ID or ALL_PROPERTIES
  onChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  showAllOption?: boolean; // Whether to show "All properties" option (default: true)
}

export default function PropertyFilter({ 
  value, 
  onChange, 
  isLoading = false,
  className = "",
  showAllOption = true
}: PropertyFilterProps) {
  const { properties, setProperties } = useProperty();
  const { t } = useLanguage();
  const [isFetching, setIsFetching] = useState(false);

  // Fetch properties on mount if not already loaded
  useEffect(() => {
    async function fetchProperties() {
      if (properties.length > 0) return;
      
      setIsFetching(true);
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const json = await res.json();
          const props = Array.isArray(json) ? json : (json.data || json.properties || []);
          setProperties(props.map((p: { id: string; name: string; address?: string | null }) => ({
            id: p.id,
            name: p.name,
            address: p.address || null,
          })));
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchProperties();
  }, [properties.length, setProperties]);

  // Don't render if only one property (no need to filter) - unless showAllOption is false
  // When showAllOption is false, we always need to show the selector to pick a property
  if (properties.length <= 1 && !isFetching && showAllOption) {
    return null;
  }

  // If we have properties and value is ALL_PROPERTIES but showAllOption is false,
  // auto-select the first property
  if (!showAllOption && value === ALL_PROPERTIES && properties.length > 0) {
    // This will trigger onChange on next render
    setTimeout(() => onChange(properties[0].id), 0);
  }

  const loading = isLoading || isFetching;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="appearance-none bg-card border border-border text-foreground rounded-lg pl-10 pr-10 py-2.5 text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        >
          {showAllOption && (
            <option value={ALL_PROPERTIES}>
              {t.overview?.filterAll || "Όλα τα ακίνητα"}
            </option>
          )}
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Building2 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}
