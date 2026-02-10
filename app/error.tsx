"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          {t.error?.title || "Something went wrong"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t.error?.description || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset} variant="default">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.error?.retry || "Try again"}
        </Button>
      </div>
    </div>
  );
}
