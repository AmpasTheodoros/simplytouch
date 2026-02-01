"use client";

import { useEffect } from "react";
import { Wifi, Leaf, Clock, ExternalLink, Home } from "lucide-react";

type GuestPageBlock =
  | { type: "welcome"; message: string }
  | { type: "wifi"; networkName: string; password: string }
  | { type: "rules"; content: string }
  | { type: "eco"; message: string; enabled: boolean }
  | { type: "links"; links: Array<{ label: string; url: string }> }
  | { type: "checkout_time"; time: string };

interface GuestPageRendererProps {
  slug: string;
  title: string;
  propertyName: string;
  blocks: GuestPageBlock[];
}

export default function GuestPageRenderer({
  slug,
  title,
  propertyName,
  blocks,
}: GuestPageRendererProps) {
  // Track scan on mount
  useEffect(() => {
    const trackScan = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        await fetch("/api/guest-pages/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            userAgent: navigator.userAgent,
            utmSource: params.get("utm_source") || undefined,
            utmMedium: params.get("utm_medium") || undefined,
          }),
        });
      } catch {
        // Silently fail
      }
    };
    trackScan();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">
            {title}
          </h1>
          <p className="text-muted-foreground">{propertyName}</p>
        </div>

        {/* Blocks */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://profitbnb.app"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProfitBnB
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function BlockRenderer({ block }: { block: GuestPageBlock }) {
  switch (block.type) {
    case "welcome":
      return (
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-foreground">{block.message}</p>
        </div>
      );

    case "wifi":
      return (
        <div className="bg-primary/5 rounded-xl border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">WiFi</span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Network</p>
              <p className="font-medium text-foreground">{block.networkName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Password</p>
              <p className="font-mono font-medium text-foreground bg-background px-2 py-1 rounded">
                {block.password}
              </p>
            </div>
          </div>
        </div>
      );

    case "rules":
      return (
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="font-medium text-foreground mb-2">House Rules</p>
          <p className="text-muted-foreground whitespace-pre-line text-sm">
            {block.content}
          </p>
        </div>
      );

    case "eco":
      if (!block.enabled) return null;
      return (
        <div className="bg-profit/5 rounded-xl border border-profit/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-profit" />
            <span className="font-medium text-profit">Eco-friendly Stay</span>
          </div>
          <p className="text-sm text-muted-foreground">{block.message}</p>
        </div>
      );

    case "checkout_time":
      return (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Check-out by</span>
            <span className="font-medium text-foreground">{block.time}</span>
          </div>
        </div>
      );

    case "links":
      return (
        <div className="space-y-2">
          {block.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:bg-secondary/50 transition-colors"
            >
              <span className="font-medium text-foreground">{link.label}</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      );

    default:
      return null;
  }
}
