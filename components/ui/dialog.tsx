"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onOpenChange(false);
        }
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200" />
      
      {/* Dialog */}
      <div className="relative z-50 animate-in fade-in-0 zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn("p-6 border-b border-border", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn("font-display font-semibold text-xl text-foreground", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn("p-6 border-t border-border flex justify-end gap-3", className)}>
      {children}
    </div>
  );
}

export function DialogClose({ 
  onClose, 
  className 
}: { 
  onClose: () => void; 
  className?: string;
}) {
  return (
    <button
      onClick={onClose}
      className={cn(
        "absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors",
        className
      )}
    >
      <X className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
