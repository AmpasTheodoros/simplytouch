"use client";

import { useTheme } from "next-themes";
import { ArrowLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { id: "light", label: t.settings.appearance.light, icon: Sun },
    { id: "dark", label: t.settings.appearance.dark, icon: Moon },
    { id: "system", label: t.settings.appearance.system, icon: Monitor },
  ];

  const languages = [
    { id: "el" as const, label: "Ελληνικά", flag: "🇬🇷" },
    { id: "en" as const, label: "English", flag: "🇬🇧" },
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <DashboardLayout title={t.settings.appearance.title} subtitle={t.settings.appearance.description}>
        <div className="max-w-2xl">
          <div className="h-96 animate-pulse bg-secondary/30 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t.settings.appearance.title} subtitle={t.settings.appearance.description}>
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.settings.backToSettings}
        </Link>

        <div className="space-y-6">
          {/* Theme Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">{t.settings.appearance.theme}</h3>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((themeOption) => {
                const isActive = theme === themeOption.id;
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto ${
                      isActive ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <p className={`text-sm font-medium text-center ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}>
                      {themeOption.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">{t.settings.appearance.language}</h3>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => {
                const isActive = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-3xl mb-2 text-center">{lang.flag}</div>
                    <p className={`text-sm font-medium text-center ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}>
                      {lang.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
