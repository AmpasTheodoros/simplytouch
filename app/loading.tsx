import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" role="status" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
