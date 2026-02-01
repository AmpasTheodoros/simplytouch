"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Default background for guest page preview
const PREVIEW_BG =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

type PageTab = "home" | "welcome" | "houseRules" | "amenities" | "explore" | "gallery";

interface PageData {
  welcome: {
    title: string;
    message: string;
    checkInTime: string;
    checkOutTime: string;
    wifiName: string;
    wifiPassword: string;
  };
  houseRules: {
    rules: string[];
  };
  amenities: {
    title: string;
    items: string[];
  };
  explore: {
    title: string;
    description: string;
    places: string[];
  };
  gallery: {
    title: string;
  };
}

const defaultData: PageData = {
  welcome: {
    title: "Καλώς ήρθατε!",
    message: "Ελπίζουμε να απολαύσετε τη διαμονή σας στο κατάλυμά μας.",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    wifiName: "Seaside_Guest",
    wifiPassword: "welcome2025",
  },
  houseRules: {
    rules: [
      "Απαγορεύεται το κάπνισμα εντός",
      "Ησυχία μετά τις 23:00",
      "Κατοικίδια επιτρέπονται με προηγούμενη συνεννόηση",
      "Check-out στις 11:00",
    ],
  },
  amenities: {
    title: "Παροχές & Ανέσεις",
    items: [
      "WiFi υψηλής ταχύτητας",
      "Κλιματισμός",
      "Πλυντήριο ρούχων",
      "Πλήρως εξοπλισμένη κουζίνα",
      "Smart TV με Netflix",
      "Στεγνωτήρας μαλλιών",
    ],
  },
  explore: {
    title: "Εξερευνήστε την περιοχή",
    description: "Το κατάλυμα βρίσκεται σε ιδανική τοποθεσία κοντά σε παραλίες και εστιατόρια.",
    places: [
      "Παραλία Μεγάλη Άμμος - 5 λεπτά",
      "Σούπερ Μάρκετ ΑΒ - 3 λεπτά",
      "Εστιατόριο Θάλασσα - 10 λεπτά",
      "Κέντρο πόλης - 15 λεπτά",
    ],
  },
  gallery: {
    title: "Gallery",
  },
};

const tabs: { id: PageTab; icon: typeof Home }[] = [
  { id: "home", icon: Home },
  { id: "welcome", icon: Smile },
  { id: "houseRules", icon: Book },
  { id: "amenities", icon: Coffee },
  { id: "explore", icon: MapPin },
  { id: "gallery", icon: Image },
];

export function NFCLiveEditor() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PageTab>("welcome");
  const [data, setData] = useState<PageData>(defaultData);

  const updateWelcome = (field: keyof PageData["welcome"], value: string) => {
    setData((prev) => ({
      ...prev,
      welcome: { ...prev.welcome, [field]: value },
    }));
  };

  const updateHouseRules = (rules: string) => {
    setData((prev) => ({
      ...prev,
      houseRules: { rules: rules.split("\n").filter((r) => r.trim()) },
    }));
  };

  const updateAmenities = (field: "title" | "items", value: string) => {
    setData((prev) => ({
      ...prev,
      amenities:
        field === "title"
          ? { ...prev.amenities, title: value }
          : { ...prev.amenities, items: value.split("\n").filter((i) => i.trim()) },
    }));
  };

  const updateExplore = (field: keyof PageData["explore"], value: string) => {
    if (field === "places") {
      setData((prev) => ({
        ...prev,
        explore: { ...prev.explore, places: value.split("\n").filter((p) => p.trim()) },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        explore: { ...prev.explore, [field]: value },
      }));
    }
  };

  const updateGallery = (title: string) => {
    setData((prev) => ({
      ...prev,
      gallery: { title },
    }));
  };

  // Editor for each page
  const renderEditor = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <Lock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{t.nfcEditor.homeReadOnly}</p>
            </div>
          </div>
        );

      case "welcome":
        return (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.welcomeTitle}
              </label>
              <input
                type="text"
                value={data.welcome.title}
                onChange={(e) => updateWelcome("title", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.welcomeMessage}
              </label>
              <textarea
                value={data.welcome.message}
                onChange={(e) => updateWelcome("message", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.nfcEditor.fields.checkInTime}
                </label>
                <input
                  type="time"
                  value={data.welcome.checkInTime}
                  onChange={(e) => updateWelcome("checkInTime", e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.nfcEditor.fields.checkOutTime}
                </label>
                <input
                  type="time"
                  value={data.welcome.checkOutTime}
                  onChange={(e) => updateWelcome("checkOutTime", e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.nfcEditor.fields.wifiName}
                </label>
                <input
                  type="text"
                  value={data.welcome.wifiName}
                  onChange={(e) => updateWelcome("wifiName", e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.nfcEditor.fields.wifiPassword}
                </label>
                <input
                  type="text"
                  value={data.welcome.wifiPassword}
                  onChange={(e) => updateWelcome("wifiPassword", e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );

      case "houseRules":
        return (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.rules}
              </label>
              <p className="text-xs text-muted-foreground mb-2">{t.nfcEditor.fields.rulesHint}</p>
              <textarea
                value={data.houseRules.rules.join("\n")}
                onChange={(e) => updateHouseRules(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-48 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case "amenities":
        return (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.amenitiesTitle}
              </label>
              <input
                type="text"
                value={data.amenities.title}
                onChange={(e) => updateAmenities("title", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.amenitiesList}
              </label>
              <p className="text-xs text-muted-foreground mb-2">{t.nfcEditor.fields.amenitiesHint}</p>
              <textarea
                value={data.amenities.items.join("\n")}
                onChange={(e) => updateAmenities("items", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-40 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case "explore":
        return (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.exploreTitle}
              </label>
              <input
                type="text"
                value={data.explore.title}
                onChange={(e) => updateExplore("title", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.exploreDescription}
              </label>
              <textarea
                value={data.explore.description}
                onChange={(e) => updateExplore("description", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.nearbyPlaces}
              </label>
              <p className="text-xs text-muted-foreground mb-2">{t.nfcEditor.fields.nearbyHint}</p>
              <textarea
                value={data.explore.places.join("\n")}
                onChange={(e) => updateExplore("places", e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.nfcEditor.fields.galleryTitle}
              </label>
              <input
                type="text"
                value={data.gallery.title}
                onChange={(e) => updateGallery(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                <span className="text-white text-sm font-medium">Seaside Apartment</span>
                <span className="text-rose-400 text-xs">&#10047;</span>
              </div>
              <Menu className="w-4 h-4 text-white" />
            </div>
            <div className="text-center py-8">
              <h5 className="font-serif italic text-white text-3xl mb-1">Seaside</h5>
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase">Apartment</p>
            </div>
            <div className="flex flex-col items-center gap-3 pb-6">
              <span className="text-white text-xs tracking-[0.15em]">WELCOME</span>
              <span className="text-white text-xs tracking-[0.15em]">HOUSE RULES</span>
              <span className="text-white text-xs tracking-[0.15em]">AMENITIES</span>
              <span className="text-white text-xs tracking-[0.15em]">EXPLORE</span>
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
                {data.welcome.title || "Welcome!"}
              </h5>
              <p className="text-[#5a4a3a] text-sm mb-4">
                {data.welcome.message || "We hope you enjoy your stay."}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                  <div className="flex items-center gap-1 text-[#8b7355] mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Check-in</span>
                  </div>
                  <p className="text-[#2c1810] font-medium">{data.welcome.checkInTime}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                  <div className="flex items-center gap-1 text-[#8b7355] mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Check-out</span>
                  </div>
                  <p className="text-[#2c1810] font-medium">{data.welcome.checkOutTime}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                <div className="flex items-center gap-1 text-rose-500 mb-1">
                  <Wifi className="w-3 h-3" />
                  <span className="text-xs font-medium">WiFi</span>
                </div>
                <p className="text-[#8b7355] text-xs mb-0.5">{data.welcome.wifiName}</p>
                <p className="text-[#2c1810] font-mono font-medium">{data.welcome.wifiPassword}</p>
              </div>
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
              <h5 className="font-serif italic text-[#1a365d] text-2xl mb-4">House Rules</h5>
              <div className="space-y-2">
                {data.houseRules.rules.map((rule, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-[#e5e5c0]">
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#2c1810] text-sm">{rule}</p>
                    </div>
                  </div>
                ))}
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
                {data.amenities.title || "Amenities"}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {data.amenities.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-[#e5e5c0] flex items-center gap-2"
                  >
                    <Coffee className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <p className="text-[#2c1810] text-xs">{item}</p>
                  </div>
                ))}
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
                {data.explore.title || "Explore"}
              </h5>
              <p className="text-[#5a4a3a] text-sm mb-4">{data.explore.description}</p>
              <div className="space-y-2">
                {data.explore.places.map((place, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-[#e5e5c0] flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
                    <p className="text-[#2c1810] text-sm">{place}</p>
                  </div>
                ))}
              </div>
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
                {data.gallery.title || "Gallery"}
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
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              {t.nfcEditor.title}
            </h2>
            <p className="text-lg text-muted-foreground">{t.nfcEditor.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
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
                    <span className="hidden sm:inline">{t.nfcEditor.pages[tab.id]}</span>
                    {isLocked && (
                      <Lock className="w-3 h-3 opacity-60" />
                    )}
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
                <span className="text-primary-foreground/70">— {t.nfcEditor.pages[activeTab]}</span>
              </div>
              <div className="min-h-[400px]">{renderEditor()}</div>
            </div>

            {/* Preview Panel */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-secondary flex items-center gap-2">
                <span className="font-semibold text-foreground">{t.nfcEditor.realTimePreview}</span>
              </div>
              <div className="p-4 min-h-[400px]">{renderPreview()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
