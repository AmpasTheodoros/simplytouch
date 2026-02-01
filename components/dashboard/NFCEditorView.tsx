"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Smile,
  Book,
  Coffee,
  MapPin,
  Image,
  Lock,
  Menu,
  Phone,
  Wifi,
  Clock,
  Star,
  Navigation,
  Save,
  Loader2,
  Plus,
  Trash2,
  Leaf,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import PropertyFilter from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { GuestPageBlock } from "@/lib/validation/guest-page";

// Default background for guest page preview
const PREVIEW_BG =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

type PageTab = "home" | "welcome" | "houseRules" | "amenities" | "explore" | "gallery";

interface GuestPageData {
  id: string;
  propertyId: string;
  slug: string;
  title: string;
  blocks: GuestPageBlock[];
  published: boolean;
}

interface EditorContent {
  // Welcome page
  welcomeMessage: string;
  checkInTime: string;
  checkOutTime: string;
  wifiName: string;
  wifiPassword: string;
  // House Rules page
  houseRules: string[];
  // Amenities page
  amenitiesTitle: string;
  amenities: string[];
  // Explore page
  exploreTitle: string;
  exploreDescription: string;
  nearbyPlaces: { name: string; distance: string }[];
  // Eco
  ecoMessage: string;
  showEcoMessage: boolean;
  // Custom Links
  customLinks: { label: string; url: string }[];
  // Gallery
  galleryTitle: string;
}

const defaultContent: EditorContent = {
  welcomeMessage: "",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  wifiName: "",
  wifiPassword: "",
  houseRules: [],
  amenitiesTitle: "",
  amenities: [],
  exploreTitle: "",
  exploreDescription: "",
  nearbyPlaces: [],
  ecoMessage: "",
  showEcoMessage: false,
  customLinks: [],
  galleryTitle: "Gallery",
};

// Convert blocks array to editor content format
function blocksToContent(blocks: GuestPageBlock[]): EditorContent {
  const content: EditorContent = { ...defaultContent };

  for (const block of blocks) {
    switch (block.type) {
      case "welcome":
        content.welcomeMessage = block.message;
        break;
      case "wifi":
        content.wifiName = block.networkName;
        content.wifiPassword = block.password;
        break;
      case "rules":
        content.houseRules = block.content.split("\n").filter((r) => r.trim());
        break;
      case "eco":
        content.ecoMessage = block.message;
        content.showEcoMessage = block.enabled;
        break;
      case "links":
        content.customLinks = block.links;
        break;
      case "checkout_time":
        content.checkOutTime = block.time;
        break;
      case "checkin_time":
        content.checkInTime = block.time;
        break;
      case "amenities":
        content.amenities = block.items.map((i) => i.title);
        break;
      case "nearby":
        content.nearbyPlaces = block.places;
        break;
      case "included":
        content.amenities = block.items;
        break;
    }
  }

  return content;
}

// Convert editor content back to blocks array
function contentToBlocks(content: EditorContent): GuestPageBlock[] {
  const blocks: GuestPageBlock[] = [];

  if (content.welcomeMessage) {
    blocks.push({ type: "welcome", message: content.welcomeMessage });
  }
  if (content.wifiName || content.wifiPassword) {
    blocks.push({
      type: "wifi",
      networkName: content.wifiName,
      password: content.wifiPassword,
    });
  }
  if (content.checkInTime) {
    blocks.push({ type: "checkin_time", time: content.checkInTime });
  }
  if (content.checkOutTime) {
    blocks.push({ type: "checkout_time", time: content.checkOutTime });
  }
  if (content.houseRules.length > 0) {
    blocks.push({ type: "rules", content: content.houseRules.join("\n") });
  }
  if (content.amenities.length > 0) {
    blocks.push({ type: "included", items: content.amenities });
  }
  if (content.nearbyPlaces.length > 0) {
    blocks.push({ type: "nearby", places: content.nearbyPlaces });
  }
  if (content.showEcoMessage || content.ecoMessage) {
    blocks.push({
      type: "eco",
      message: content.ecoMessage,
      enabled: content.showEcoMessage,
    });
  }
  if (content.customLinks.length > 0) {
    blocks.push({ type: "links", links: content.customLinks });
  }

  return blocks;
}

const tabs: { id: PageTab; icon: typeof Home }[] = [
  { id: "home", icon: Home },
  { id: "welcome", icon: Smile },
  { id: "houseRules", icon: Book },
  { id: "amenities", icon: Coffee },
  { id: "explore", icon: MapPin },
  { id: "gallery", icon: Image },
];

export default function NFCEditorView() {
  const { t } = useLanguage();
  const { properties } = useProperty();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [guestPage, setGuestPage] = useState<GuestPageData | null>(null);
  const [content, setContent] = useState<EditorContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<PageTab>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Get property name for display
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  // Fetch guest page when property changes
  const fetchGuestPage = useCallback(async (propertyId: string) => {
    if (!propertyId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/guest-pages?propertyId=${propertyId}`);
      if (res.ok) {
        const pages: GuestPageData[] = await res.json();
        if (pages.length > 0) {
          const page = pages[0];
          setGuestPage(page);
          setContent(blocksToContent(page.blocks));
        } else {
          setGuestPage(null);
          setContent(defaultContent);
        }
      }
    } catch (error) {
      console.error("Failed to fetch guest page:", error);
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, []);

  // Fetch when property changes
  useEffect(() => {
    if (selectedPropertyId) {
      fetchGuestPage(selectedPropertyId);
    }
  }, [selectedPropertyId, fetchGuestPage]);

  // Update content helper
  const updateContent = <K extends keyof EditorContent>(
    field: K,
    value: EditorContent[K]
  ) => {
    setContent((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Save changes
  const handleSave = async () => {
    if (!selectedPropertyId) return;

    setIsSaving(true);
    try {
      const blocks = contentToBlocks(content);

      if (guestPage) {
        // Update existing guest page
        const res = await fetch(`/api/guest-pages/${guestPage.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocks }),
        });

        if (res.ok) {
          const updated = await res.json();
          setGuestPage(updated);
          setHasChanges(false);
        }
      } else {
        // Create new guest page
        const res = await fetch("/api/guest-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: selectedPropertyId,
            title: selectedProperty?.name || "Guest Page",
            blocks,
            published: true,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setGuestPage(created);
          setHasChanges(false);
        }
      }
    } catch (error) {
      console.error("Failed to save guest page:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Link helpers
  const addLink = () => {
    updateContent("customLinks", [...content.customLinks, { label: "", url: "" }]);
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const updated = content.customLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    updateContent("customLinks", updated);
  };

  const removeLink = (index: number) => {
    updateContent(
      "customLinks",
      content.customLinks.filter((_, i) => i !== index)
    );
  };

  // Nearby place helpers
  const addNearbyPlace = () => {
    updateContent("nearbyPlaces", [
      ...content.nearbyPlaces,
      { name: "", distance: "" },
    ]);
  };

  const updateNearbyPlace = (
    index: number,
    field: "name" | "distance",
    value: string
  ) => {
    const updated = content.nearbyPlaces.map((place, i) =>
      i === index ? { ...place, [field]: value } : place
    );
    updateContent("nearbyPlaces", updated);
  };

  const removeNearbyPlace = (index: number) => {
    updateContent(
      "nearbyPlaces",
      content.nearbyPlaces.filter((_, i) => i !== index)
    );
  };

  // Editor for each page
  const renderEditor = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <Lock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground max-w-sm">
                {t.nfcEditor.homeReadOnly}
              </p>
            </div>
          </div>
        );

      case "welcome":
        return (
          <div className="p-6 space-y-4">
            <div>
              <Label>{t.nfcEditor.fields.welcomeMessage}</Label>
              <Textarea
                value={content.welcomeMessage}
                onChange={(e) => updateContent("welcomeMessage", e.target.value)}
                rows={3}
                placeholder="Καλώς ήρθατε στο κατάλυμά μας!"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.nfcEditor.fields.checkInTime}</Label>
                <Input
                  type="time"
                  value={content.checkInTime}
                  onChange={(e) => updateContent("checkInTime", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{t.nfcEditor.fields.checkOutTime}</Label>
                <Input
                  type="time"
                  value={content.checkOutTime}
                  onChange={(e) => updateContent("checkOutTime", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t.nfcEditor.fields.wifiName}</Label>
                <Input
                  value={content.wifiName}
                  onChange={(e) => updateContent("wifiName", e.target.value)}
                  placeholder="MyNetwork"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>{t.nfcEditor.fields.wifiPassword}</Label>
                <Input
                  value={content.wifiPassword}
                  onChange={(e) => updateContent("wifiPassword", e.target.value)}
                  placeholder="password123"
                  className="mt-1.5"
                />
              </div>
            </div>
            {/* Eco Message */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-profit" />
                  <Label className="mb-0">{t.nfcEditor.fields.ecoMessage}</Label>
                </div>
                <Switch
                  checked={content.showEcoMessage}
                  onCheckedChange={(checked) =>
                    updateContent("showEcoMessage", checked)
                  }
                />
              </div>
              {content.showEcoMessage && (
                <Textarea
                  value={content.ecoMessage}
                  onChange={(e) => updateContent("ecoMessage", e.target.value)}
                  rows={2}
                  placeholder="Παρακαλούμε σβήνετε τα φώτα όταν φεύγετε..."
                />
              )}
            </div>
          </div>
        );

      case "houseRules":
        return (
          <div className="p-6 space-y-4">
            <div>
              <Label>{t.nfcEditor.fields.rules}</Label>
              <p className="text-xs text-muted-foreground mb-2">
                {t.nfcEditor.fields.rulesHint}
              </p>
              <Textarea
                value={content.houseRules.join("\n")}
                onChange={(e) =>
                  updateContent(
                    "houseRules",
                    e.target.value.split("\n").filter((r) => r.trim())
                  )
                }
                rows={10}
                placeholder="Απαγορεύεται το κάπνισμα&#10;Ησυχία μετά τις 23:00&#10;Check-out στις 11:00"
                className="mt-1.5"
              />
            </div>
          </div>
        );

      case "amenities":
        return (
          <div className="p-6 space-y-4">
            <div>
              <Label>{t.nfcEditor.fields.amenitiesList}</Label>
              <p className="text-xs text-muted-foreground mb-2">
                {t.nfcEditor.fields.amenitiesHint}
              </p>
              <Textarea
                value={content.amenities.join("\n")}
                onChange={(e) =>
                  updateContent(
                    "amenities",
                    e.target.value.split("\n").filter((a) => a.trim())
                  )
                }
                rows={10}
                placeholder="WiFi υψηλής ταχύτητας&#10;Κλιματισμός&#10;Πλυντήριο ρούχων"
                className="mt-1.5"
              />
            </div>
          </div>
        );

      case "explore":
        return (
          <div className="p-6 space-y-4">
            <div>
              <Label>{t.nfcEditor.fields.exploreDescription}</Label>
              <Textarea
                value={content.exploreDescription}
                onChange={(e) =>
                  updateContent("exploreDescription", e.target.value)
                }
                rows={2}
                placeholder="Το κατάλυμα βρίσκεται κοντά σε..."
                className="mt-1.5"
              />
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="mb-0">{t.nfcEditor.fields.nearbyPlaces}</Label>
                <Button variant="outline" size="sm" onClick={addNearbyPlace}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t.add}
                </Button>
              </div>
              <div className="space-y-2">
                {content.nearbyPlaces.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t.nfcEditor.fields.nearbyHint}
                  </p>
                ) : (
                  content.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={place.name}
                        onChange={(e) =>
                          updateNearbyPlace(index, "name", e.target.value)
                        }
                        placeholder="Παραλία"
                        className="flex-1"
                      />
                      <Input
                        value={place.distance}
                        onChange={(e) =>
                          updateNearbyPlace(index, "distance", e.target.value)
                        }
                        placeholder="5 λεπτά"
                        className="w-28"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNearbyPlace(index)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Custom Links */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  <Label className="mb-0">{t.nfcEditor.fields.customLinks}</Label>
                </div>
                <Button variant="outline" size="sm" onClick={addLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t.nfcEditor.fields.addLink}
                </Button>
              </div>
              <div className="space-y-2">
                {content.customLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t.nfcEditor.fields.noLinks}
                  </p>
                ) : (
                  content.customLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={link.label}
                        onChange={(e) => updateLink(index, "label", e.target.value)}
                        placeholder={t.nfcEditor.fields.linkLabel}
                        className="flex-1"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(index, "url", e.target.value)}
                        placeholder="https://"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(index)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="p-6 space-y-4">
            <div>
              <Label>{t.nfcEditor.fields.galleryTitle}</Label>
              <Input
                value={content.galleryTitle}
                onChange={(e) => updateContent("galleryTitle", e.target.value)}
                placeholder="Gallery"
                className="mt-1.5"
              />
            </div>
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image className="w-5 h-5" />
                <span className="text-sm">{t.nfcEditor.fields.galleryHint}</span>
              </div>
              {/* Mock gallery grid */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <Image className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  // Preview for each page
  const renderPreview = () => {
    switch (activeTab) {
      case "home":
        return (
          <div
            className="h-full rounded-xl overflow-hidden"
            style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${PREVIEW_BG}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-medium truncate max-w-[140px]">
                  {selectedProperty?.name || "Property"}
                </span>
                <span className="text-rose-400 text-xs">&#10047;</span>
              </div>
              <Menu className="w-4 h-4 text-white" />
            </div>
            <div className="text-center py-8">
              <h5 className="font-serif italic text-white text-3xl mb-1">
                {selectedProperty?.name?.split(" ")[0] || "Property"}
              </h5>
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase">
                {selectedProperty?.name?.split(" ").slice(1).join(" ") || "Apartment"}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 pb-6">
              <span
                className={`text-xs tracking-[0.15em] ${content.welcomeMessage ? "text-white" : "text-white/40"}`}
              >
                WELCOME
              </span>
              <span
                className={`text-xs tracking-[0.15em] ${content.houseRules.length > 0 ? "text-white" : "text-white/40"}`}
              >
                HOUSE RULES
              </span>
              <span
                className={`text-xs tracking-[0.15em] ${content.amenities.length > 0 ? "text-white" : "text-white/40"}`}
              >
                AMENITIES
              </span>
              <span
                className={`text-xs tracking-[0.15em] ${content.nearbyPlaces.length > 0 || content.customLinks.length > 0 ? "text-white" : "text-white/40"}`}
              >
                EXPLORE
              </span>
              <span className="text-white/40 text-xs tracking-[0.15em]">GALLERY</span>
            </div>
            <div className="flex justify-center gap-2 px-4 pb-4">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-full">
                <MapPin className="w-3 h-3 text-gray-700" />
                <span className="text-[10px] text-gray-700 font-medium">Location</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-full">
                <Phone className="w-3 h-3 text-white" />
                <span className="text-[10px] text-white font-medium">Contact</span>
              </div>
            </div>
          </div>
        );

      case "welcome":
        return (
          <div className="h-full rounded-xl overflow-hidden bg-[#f5f5dc]">
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e5c0]">
              <span className="text-[#8b7355] text-xs">← Back</span>
              <span className="text-[#2c1810] text-sm font-medium">Welcome</span>
              <span className="w-8" />
            </div>
            <div className="p-4">
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-2">
                Welcome!
              </h5>
              <p className="text-[#5a4a3a] text-sm mb-4">
                {content.welcomeMessage || "Your welcome message will appear here."}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                  <div className="flex items-center gap-1 text-[#8b7355] mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Check-in</span>
                  </div>
                  <p className="text-[#2c1810] font-medium">
                    {content.checkInTime || "15:00"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                  <div className="flex items-center gap-1 text-[#8b7355] mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Check-out</span>
                  </div>
                  <p className="text-[#2c1810] font-medium">
                    {content.checkOutTime || "11:00"}
                  </p>
                </div>
              </div>
              {(content.wifiName || content.wifiPassword) && (
                <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                  <div className="flex items-center gap-1 text-rose-500 mb-1">
                    <Wifi className="w-3 h-3" />
                    <span className="text-xs font-medium">WiFi</span>
                  </div>
                  <p className="text-[#8b7355] text-xs mb-0.5">{content.wifiName}</p>
                  <p className="text-[#2c1810] font-mono font-medium">
                    {content.wifiPassword}
                  </p>
                </div>
              )}
              {content.showEcoMessage && content.ecoMessage && (
                <div className="mt-3 bg-profit/10 rounded-lg p-3 border border-profit/20">
                  <div className="flex items-center gap-1 text-profit mb-1">
                    <Leaf className="w-3 h-3" />
                    <span className="text-xs font-medium">Eco</span>
                  </div>
                  <p className="text-[#2c1810] text-xs">{content.ecoMessage}</p>
                </div>
              )}
            </div>
          </div>
        );

      case "houseRules":
        return (
          <div className="h-full rounded-xl overflow-hidden bg-[#f5f5dc]">
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e5c0]">
              <span className="text-[#8b7355] text-xs">← Back</span>
              <span className="text-[#2c1810] text-sm font-medium">House Rules</span>
              <span className="w-8" />
            </div>
            <div className="p-4">
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-4">
                House Rules
              </h5>
              <div className="space-y-2">
                {content.houseRules.length === 0 ? (
                  <p className="text-[#8b7355] text-sm">
                    Your house rules will appear here.
                  </p>
                ) : (
                  content.houseRules.map((rule, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-3 border border-[#e5e5c0]"
                    >
                      <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[#2c1810] text-sm">{rule}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "amenities":
        return (
          <div className="h-full rounded-xl overflow-hidden bg-[#f5f5dc]">
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e5c0]">
              <span className="text-[#8b7355] text-xs">← Back</span>
              <span className="text-[#2c1810] text-sm font-medium">Amenities</span>
              <span className="w-8" />
            </div>
            <div className="p-4">
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-4">
                Amenities
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {content.amenities.length === 0 ? (
                  <p className="text-[#8b7355] text-sm col-span-2">
                    Your amenities will appear here.
                  </p>
                ) : (
                  content.amenities.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-3 border border-[#e5e5c0] flex items-center gap-2"
                    >
                      <Coffee className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <p className="text-[#2c1810] text-xs">{item}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "explore":
        return (
          <div className="h-full rounded-xl overflow-hidden bg-[#f5f5dc]">
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e5c0]">
              <span className="text-[#8b7355] text-xs">← Back</span>
              <span className="text-[#2c1810] text-sm font-medium">Explore</span>
              <span className="w-8" />
            </div>
            <div className="p-4">
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-2">
                Explore
              </h5>
              {content.exploreDescription && (
                <p className="text-[#5a4a3a] text-sm mb-4">
                  {content.exploreDescription}
                </p>
              )}
              {content.nearbyPlaces.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-[#8b7355] text-xs font-medium">Nearby</p>
                  {content.nearbyPlaces.map((place, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-3 border border-[#e5e5c0] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
                        <p className="text-[#2c1810] text-sm">{place.name}</p>
                      </div>
                      <span className="text-[#8b7355] text-xs">{place.distance}</span>
                    </div>
                  ))}
                </div>
              )}
              {content.customLinks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[#8b7355] text-xs font-medium">Links</p>
                  {content.customLinks.map((link, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg p-3 border border-[#e5e5c0] flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-[#2c1810] text-sm">{link.label || link.url}</p>
                    </div>
                  ))}
                </div>
              )}
              {content.nearbyPlaces.length === 0 && content.customLinks.length === 0 && (
                <p className="text-[#8b7355] text-sm">
                  Add nearby places and links to help guests explore.
                </p>
              )}
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="h-full rounded-xl overflow-hidden bg-[#f5f5dc]">
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e5c0]">
              <span className="text-[#8b7355] text-xs">← Back</span>
              <span className="text-[#2c1810] text-sm font-medium">Gallery</span>
              <span className="w-8" />
            </div>
            <div className="p-4">
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-4">
                {content.galleryTitle || "Gallery"}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white rounded-lg border border-[#e5e5c0] flex items-center justify-center"
                    style={{
                      backgroundImage: i <= 2 ? `url("${PREVIEW_BG}")` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {i > 2 && <Image className="w-8 h-8 text-[#e5e5c0]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Property Selector and Save Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <PropertyFilter
          value={selectedPropertyId}
          onChange={setSelectedPropertyId}
          showAllOption={false}
        />

        {selectedPropertyId && !isLoading && (
          <div className="flex items-center gap-3">
            {guestPage && (
              <a
                href={`/g/${guestPage.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                /g/{guestPage.slug}
              </a>
            )}
            {hasChanges && (
              <span className="text-sm text-warning">
                • {t.nfcEditor.unsavedChanges}
              </span>
            )}
            <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {guestPage ? t.save : t.nfcEditor.createPage}
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* No Property Selected */}
      {!selectedPropertyId && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          {t.nfcEditor.noPropertySelected}
        </div>
      )}

      {/* Editor Content */}
      {selectedPropertyId && !isLoading && (
        <>
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex bg-card rounded-xl p-1.5 border border-border shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isLocked = tab.id === "home";

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t.nfcEditor.pages[tab.id]}
                    </span>
                    {isLocked && <Lock className="w-3 h-3 opacity-60" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor + Preview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-primary text-primary-foreground flex items-center gap-2">
                <span className="font-semibold">{t.nfcEditor.editSection}</span>
                <span className="text-primary-foreground/70">
                  — {t.nfcEditor.pages[activeTab]}
                </span>
              </div>
              <div className="min-h-[450px] max-h-[600px] overflow-y-auto">
                {renderEditor()}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-secondary flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {t.nfcEditor.realTimePreview}
                </span>
              </div>
              <div className="p-4 min-h-[450px]">{renderPreview()}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
