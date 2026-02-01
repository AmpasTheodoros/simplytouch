"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Wifi, Clock, Menu, X, MapPin, Phone, ChevronLeft, Star, AlertTriangle,
  User, Car, Bus, Train, Check, Utensils, Tv, Bath, UtensilsCrossed, Waves,
  ParkingCircle, Droplets, Wind, Image as ImageIcon
} from "lucide-react";

type GuestPageBlock =
  | { type: "welcome"; message: string }
  | { type: "wifi"; networkName: string; password: string }
  | { type: "rules"; content: string }
  | { type: "eco"; message: string; enabled: boolean }
  | { type: "links"; links: Array<{ label: string; url: string }> }
  | { type: "checkout_time"; time: string }
  | { type: "checkin_time"; time: string }
  | { type: "host"; name: string; description: string; image?: string }
  | { type: "amenities"; items: Array<{ icon: string; title: string; description: string }> }
  | { type: "included"; items: string[] }
  | { type: "important_reminder"; message: string }
  | { type: "location"; address: string; city: string; country: string; mapUrl?: string; directions?: { car?: string; bus?: string; train?: string } }
  | { type: "nearby"; places: Array<{ name: string; distance: string }> }
  | { type: "explore_categories"; categories: Array<{ title: string; image?: string; icon?: string }> };

interface GuestPageRendererProps {
  slug: string;
  title: string;
  propertyName: string;
  blocks: GuestPageBlock[];
  backgroundImage?: string;
  propertyType?: string;
}

// Default background image
const DEFAULT_BG = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

// Translations
const translations = {
  en: {
    welcome: "Welcome!",
    welcomeSubtitle: "Please, make yourself at home!",
    meetTheHost: "Meet the host",
    checkInOut: "Check-in & Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    wifiInfo: "Wi-Fi Information",
    network: "Network",
    password: "Password",
    houseRules: "House Rules",
    rulesSubtitle: "(not to worry, just the standard ones)",
    importantReminder: "Important reminder:",
    amenities: "Apartment Amenities",
    amenitiesSubtitle: "Our seaside apartment offers everything you need for a comfortable and enjoyable stay. Here are some of the amenities you'll enjoy:",
    whatsIncluded: "What's Included",
    explore: "Explore",
    exploreSubtitle: "Discover everything the area has to offer with our local recommendations",
    location: "Location",
    locationSubtitle: "Our apartment is perfectly situated to enjoy everything the area has to offer, from pristine beaches to local attractions.",
    ourAddress: "Our Address",
    gettingHere: "Getting Here",
    byCar: "By Car",
    byBus: "By Bus",
    byTrain: "By Train",
    nearbyAttractions: "Nearby Attractions",
    gallery: "Gallery",
    contact: "Contact",
    poweredBy: "Powered by",
  },
  el: {
    welcome: "Καλώς ήρθατε!",
    welcomeSubtitle: "Νιώστε σαν στο σπίτι σας!",
    meetTheHost: "Γνωρίστε τον οικοδεσπότη",
    checkInOut: "Check-in & Check-out",
    checkIn: "Check-in",
    checkOut: "Check-out",
    wifiInfo: "Πληροφορίες Wi-Fi",
    network: "Δίκτυο",
    password: "Κωδικός",
    houseRules: "Κανόνες Σπιτιού",
    rulesSubtitle: "(μην ανησυχείτε, απλά τα βασικά)",
    importantReminder: "Σημαντική υπενθύμιση:",
    amenities: "Παροχές Καταλύματος",
    amenitiesSubtitle: "Το κατάλυμά μας προσφέρει όλα όσα χρειάζεστε για μια άνετη διαμονή.",
    whatsIncluded: "Τι Περιλαμβάνεται",
    explore: "Εξερευνήστε",
    exploreSubtitle: "Ανακαλύψτε όλα όσα προσφέρει η περιοχή με τις τοπικές μας προτάσεις",
    location: "Τοποθεσία",
    locationSubtitle: "Το διαμέρισμά μας βρίσκεται σε ιδανική τοποθεσία για να απολαύσετε τα πάντα.",
    ourAddress: "Η Διεύθυνσή μας",
    gettingHere: "Πώς να Φτάσετε",
    byCar: "Με Αυτοκίνητο",
    byBus: "Με Λεωφορείο",
    byTrain: "Με Τρένο",
    nearbyAttractions: "Κοντινά Αξιοθέατα",
    gallery: "Γκαλερί",
    contact: "Επικοινωνία",
    poweredBy: "Powered by",
  },
};

type Language = keyof typeof translations;
type PageType = "home" | "welcome" | "rules" | "amenities" | "explore" | "gallery" | "location";

// Navigation items - defined outside component
const NAV_ITEMS = [
  { id: "welcome" as const, label: "WELCOME" },
  { id: "rules" as const, label: "HOUSE RULES" },
  { id: "amenities" as const, label: "AMENITIES" },
  { id: "explore" as const, label: "EXPLORE" },
  { id: "gallery" as const, label: "GALLERY", disabled: true },
];

export default function GuestPageRenderer({
  slug,
  title,
  propertyName,
  blocks,
  backgroundImage = DEFAULT_BG,
  propertyType = "APARTMENT",
}: GuestPageRendererProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const t = translations[lang];

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

  // Get block data - with type assertions
  const getBlock = <T extends GuestPageBlock["type"]>(type: T) => 
    blocks.find((b) => b.type === type) as Extract<GuestPageBlock, { type: T }> | undefined;

  const welcomeBlock = getBlock("welcome");
  const rulesBlock = getBlock("rules");
  const wifiBlock = getBlock("wifi");
  const checkoutBlock = getBlock("checkout_time");
  const checkinBlock = getBlock("checkin_time");
  const hostBlock = getBlock("host");
  const amenitiesBlock = getBlock("amenities");
  const includedBlock = getBlock("included");
  const importantBlock = getBlock("important_reminder");
  const locationBlock = getBlock("location");
  const nearbyBlock = getBlock("nearby");
  const exploreBlock = getBlock("explore_categories");
  const linksBlock = getBlock("links");

  // Navigation handler - using useCallback
  const handleNavClick = useCallback((pageId: PageType) => {
    console.log("Navigating to:", pageId);
    setCurrentPage(pageId);
    setMenuOpen(false);
  }, []);

  const goHome = useCallback(() => {
    setCurrentPage("home");
    setMenuOpen(false);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === "en" ? "el" : "en");
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  // HOME PAGE
  if (currentPage === "home") {
    return (
      <div 
        className="min-h-screen relative flex flex-col"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${backgroundImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg tracking-wide text-white">
              {title}
            </h1>
            <span className="text-rose-500">&#10047;</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={toggleLang}
              className="text-sm font-medium px-2 py-1 rounded text-white/70 hover:text-white"
            >
              {lang === "en" ? "GR" : "EN"}
            </button>
            <button 
              type="button"
              onClick={toggleMenu}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Menu Overlay */}
        {menuOpen && (
          <div className="fixed inset-0 bg-[#1a1a2e]/95 z-50 flex flex-col items-center justify-center">
            <button 
              type="button"
              onClick={toggleMenu}
              className="absolute top-4 right-6 text-white p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <span className="text-white font-semibold">{title}</span>
              <span className="text-rose-500">&#10047;</span>
            </div>
            <nav className="flex flex-col items-center gap-6">
              <button 
                type="button"
                onClick={goHome} 
                className="text-2xl font-light tracking-[0.2em] text-white hover:text-primary"
              >
                HOME
              </button>
              {NAV_ITEMS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => !item.disabled && handleNavClick(item.id)}
                  className={`text-2xl font-light tracking-[0.2em] transition-colors ${
                    item.disabled 
                      ? "text-white/40 cursor-not-allowed" 
                      : "text-white hover:text-primary cursor-pointer"
                  }`}
                  disabled={item.disabled}
                >
                  {item.label}
                </button>
              ))}
              <button 
                type="button"
                onClick={() => handleNavClick("location")} 
                className="text-2xl font-light tracking-[0.2em] text-white hover:text-primary"
              >
                LOCATION
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-serif italic text-white text-5xl md:text-6xl mb-2">
              {propertyName}
            </h2>
            <p className="text-white/70 text-sm tracking-[0.3em] uppercase">
              {propertyType}
            </p>
          </div>

          <nav className="flex flex-col items-center gap-4 mb-12">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => !item.disabled && handleNavClick(item.id)}
                className={`text-xl md:text-2xl font-light tracking-[0.2em] transition-all cursor-pointer ${
                  item.disabled 
                    ? "text-white/40 cursor-not-allowed" 
                    : "text-white hover:text-primary hover:scale-105 active:scale-95"
                }`}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 flex justify-center gap-4 relative z-10">
          <button 
            type="button"
            onClick={() => handleNavClick("location")}
            className="flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white text-gray-900 rounded-full font-medium transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            {t.location}
          </button>
          <button 
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            {t.contact}
          </button>
        </footer>

        <div className="text-center pb-4 relative z-10">
          <p className="text-xs text-white/50">
            {t.poweredBy}{" "}
            <a href="https://SimplyTouch.app" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              SimplyTouch
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Shared header for inner pages
  const innerHeader = (
    <header className="flex items-center justify-between px-6 py-4 bg-[#1a1a2e]">
      <div className="flex items-center gap-2">
        <button type="button" onClick={goHome} className="text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg tracking-wide text-white">
          {title}
        </h1>
        <span className="text-rose-500">&#10047;</span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={toggleLang}
          className="text-sm font-medium px-2 py-1 rounded text-white/70 hover:text-white"
        >
          {lang === "en" ? "GR" : "EN"}
        </button>
        <button 
          type="button"
          onClick={toggleMenu}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );

  // Shared menu overlay for inner pages
  const menuOverlay = menuOpen && (
    <div className="fixed inset-0 bg-[#1a1a2e]/95 z-50 flex flex-col items-center justify-center">
      <button 
        type="button"
        onClick={toggleMenu}
        className="absolute top-4 right-6 text-white p-2"
        aria-label="Close menu"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <span className="text-white font-semibold">{title}</span>
        <span className="text-rose-500">&#10047;</span>
      </div>
      <nav className="flex flex-col items-center gap-6">
        <button type="button" onClick={goHome} className="text-2xl font-light tracking-[0.2em] text-white hover:text-primary">
          HOME
        </button>
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => !item.disabled && handleNavClick(item.id)}
            className={`text-2xl font-light tracking-[0.2em] transition-colors ${
              currentPage === item.id ? "text-primary" : 
              item.disabled ? "text-white/40 cursor-not-allowed" : "text-white hover:text-primary"
            }`}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => handleNavClick("location")} className="text-2xl font-light tracking-[0.2em] text-white hover:text-primary">
          LOCATION
        </button>
      </nav>
    </div>
  );

  // WELCOME PAGE
  if (currentPage === "welcome") {
    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif italic text-[#1a365d] text-5xl mb-2">{t.welcome}</h1>
            <p className="text-gray-600">{welcomeBlock?.message || t.welcomeSubtitle}</p>
          </div>

          {/* Meet the Host */}
          <div className="bg-[#e8f4f8] rounded-xl p-6 mb-8 grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-serif italic text-[#1a365d] text-2xl mb-4">{t.meetTheHost}</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <span className="text-primary font-medium">{hostBlock?.name || "Your Host"}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {hostBlock?.description || "Say hello to your warm and welcoming host who's passionate about sharing the beauty of this area with travelers from around the globe."}
              </p>
            </div>
            <div className="flex items-center justify-center">
              {hostBlock?.image ? (
                <img src={hostBlock.image} alt={hostBlock.name} className="w-full max-w-[280px] rounded-xl object-cover" />
              ) : (
                <div className="w-full max-w-[280px] h-[280px] bg-gray-300 rounded-xl flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Check-in/out and WiFi */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-serif italic text-[#1a365d] text-xl mb-4">{t.checkInOut}</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">{t.checkIn}:</span> {checkinBlock?.time ? `From ${checkinBlock.time}` : "From 15:00 - 20:00"}</p>
                <p><span className="font-medium">{t.checkOut}:</span> {checkoutBlock?.time ? `Before ${checkoutBlock.time}` : "Before 11:00"}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-serif italic text-[#c53030] text-xl mb-4">{t.wifiInfo}</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">{t.network}:</span> {wifiBlock?.networkName || "TP-Link_85CC"}</p>
                <p><span className="font-medium">{t.password}:</span> <span className="font-mono">{wifiBlock?.password || "6945396538"}</span></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // HOUSE RULES PAGE
  if (currentPage === "rules") {
    const rules = rulesBlock?.content?.split("\n").filter(r => r.trim()) || [
      "Please refrain from throwing anything into the toilet basin or littering.",
      "Please observe silence between 15:30 - 17:30.",
      "Smoking is strictly not permitted inside the entire property.",
      "Please remember to switch the air-conditions off when you are away.",
      "The tap water is strictly NON potable throughout the village.",
    ];

    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif italic text-[#1a365d] text-5xl mb-2">{t.houseRules}</h1>
            <p className="text-gray-600">{t.rulesSubtitle}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div key={i} className="flex gap-3">
                  <Star className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{rule.replace(/^[•\-\*]\s*/, "")}</p>
                </div>
              ))}
            </div>
          </div>

          {importantBlock && (
            <div className="bg-rose-50 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">{t.importantReminder}</span>{" "}
                {importantBlock.message}
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // AMENITIES PAGE
  if (currentPage === "amenities") {
    const defaultAmenities = [
      { icon: "wifi", title: "High-Speed WiFi", description: "Stay connected with complimentary high-speed internet" },
      { icon: "tv", title: "Smart TV", description: "55-inch smart TV with Netflix and streaming services" },
      { icon: "bath", title: "Full Bathroom", description: "Modern bathroom with shower and premium toiletries" },
      { icon: "kitchen", title: "Fully Equipped Kitchen", description: "Modern kitchen with all necessary appliances" },
      { icon: "beach", title: "Beach Access", description: "Direct access to the beach just steps away" },
      { icon: "parking", title: "Free Parking", description: "Complimentary parking space for one vehicle" },
      { icon: "water", title: "Hot Water", description: "Continuous hot water supply in bathroom and kitchen" },
      { icon: "dining", title: "Dining Area", description: "Comfortable dining space for up to 4 guests" },
      { icon: "ac", title: "Air Conditioning", description: "Climate control to keep you comfortable year-round" },
    ];

    const amenities = amenitiesBlock?.items || defaultAmenities;
    const included = includedBlock?.items || [
      "Bed linens and towels", "Coffee maker and basic supplies",
      "Dishware and utensils", "Refrigerator and microwave",
      "Shampoo and body wash", "Hair dryer",
      "Iron and ironing board", "Beach towels and chairs",
    ];

    const getIcon = (iconName: string) => {
      const icons: Record<string, React.ReactNode> = {
        wifi: <Wifi className="w-6 h-6" />,
        tv: <Tv className="w-6 h-6" />,
        bath: <Bath className="w-6 h-6" />,
        kitchen: <UtensilsCrossed className="w-6 h-6" />,
        beach: <Waves className="w-6 h-6" />,
        parking: <ParkingCircle className="w-6 h-6" />,
        water: <Droplets className="w-6 h-6" />,
        dining: <Utensils className="w-6 h-6" />,
        ac: <Wind className="w-6 h-6" />,
      };
      return icons[iconName] || <Check className="w-6 h-6" />;
    };

    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif italic text-[#1a365d] text-4xl mb-2">{t.amenities}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">{t.amenitiesSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {amenities.map((amenity, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-3">
                  {getIcon(amenity.icon)}
                </div>
                <h3 className="font-serif italic text-[#1a365d] text-lg mb-1">{amenity.title}</h3>
                <p className="text-gray-600 text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-serif italic text-[#1a365d] text-xl mb-4">{t.whatsIncluded}</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {included.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-500" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // EXPLORE PAGE
  if (currentPage === "explore") {
    const defaultCategories = [
      { title: "Local Restaurants & Cafe", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
      { title: "Places to Visit", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
      { title: "Best Beaches", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
      { title: "Emergency Numbers", image: "" },
      { title: "Auto/Moto Rentals", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400" },
      { title: "Activities", image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400" },
      { title: "Gas Stations", image: "" },
      { title: "Pharmacy", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400" },
      { title: "Other Places", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400" },
    ];

    const categories = exploreBlock?.categories || linksBlock?.links.map(l => ({ title: l.label, image: "" })) || defaultCategories;

    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif italic text-[#1a365d] text-5xl mb-2">{t.explore}</h1>
            <p className="text-gray-600">{t.exploreSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group"
                style={{
                  background: cat.image 
                    ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("${cat.image}")`
                    : "linear-gradient(135deg, #e5e5e5, #f5f5f5)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {!cat.image && (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <h3 className={`font-medium text-center px-4 ${cat.image ? "text-white" : "text-gray-700"}`}>
                    {cat.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // LOCATION PAGE
  if (currentPage === "location") {
    const address = locationBlock?.address || "123 Seaside Boulevard";
    const city = locationBlock?.city || "Coastal Town, CT 12345";
    const country = locationBlock?.country || "United States";
    const directions = locationBlock?.directions || {
      car: "30 minutes from Highway 101, free parking on premises",
      bus: "Bus station 10 minutes walking distance",
      train: "Coastal Town Station is 15 minutes by taxi",
    };
    const nearby = nearbyBlock?.places || [
      { name: "Sandy Beach", distance: "2 minute walk" },
      { name: "Ocean Boardwalk", distance: "5 minute walk" },
      { name: "Seaside Market", distance: "10 minute walk" },
      { name: "Coastal Town Center", distance: "15 minute walk" },
      { name: "Oceanview Restaurant", distance: "8 minute walk" },
      { name: "Water Sports Center", distance: "12 minute walk" },
    ];

    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif italic text-[#1a365d] text-5xl mb-2">{t.location}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">{t.locationSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-serif italic text-[#1a365d] text-xl mb-4">{t.ourAddress}</h3>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div className="text-gray-700">
                  <p>{address}</p>
                  <p>{city}</p>
                  <p>{country}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 rounded-xl overflow-hidden h-[200px] flex items-center justify-center">
              {locationBlock?.mapUrl ? (
                <iframe 
                  src={locationBlock.mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Map Preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="font-serif italic text-[#1a365d] text-xl mb-4">{t.gettingHere}</h3>
            <div className="space-y-4">
              {directions.car && (
                <div className="flex gap-3">
                  <Car className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{t.byCar}</p>
                    <p className="text-gray-600 text-sm">{directions.car}</p>
                  </div>
                </div>
              )}
              {directions.bus && (
                <div className="flex gap-3">
                  <Bus className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{t.byBus}</p>
                    <p className="text-gray-600 text-sm">{directions.bus}</p>
                  </div>
                </div>
              )}
              {directions.train && (
                <div className="flex gap-3">
                  <Train className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{t.byTrain}</p>
                    <p className="text-gray-600 text-sm">{directions.train}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-serif italic text-[#1a365d] text-xl mb-4">{t.nearbyAttractions}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearby.map((place, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{place.name}</p>
                    <p className="text-gray-500 text-xs">{place.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // GALLERY PAGE (placeholder)
  if (currentPage === "gallery") {
    return (
      <div className="min-h-screen bg-[#f5f5dc]">
        {innerHeader}
        {menuOverlay}

        <main className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="font-serif italic text-[#1a365d] text-5xl mb-4">{t.gallery}</h1>
          <p className="text-gray-600">Coming soon...</p>
        </main>
      </div>
    );
  }

  // Fallback
  return null;
}
