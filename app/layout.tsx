import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { PropertyProvider } from "@/components/providers/PropertyProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SimplyTouch - Γνώρισε το πραγματικό σου κέρδος ανά κράτηση",
  description: "Η πλατφόρμα που δείχνει το πραγματικό κέρδος ανά κράτηση. Όχι έσοδα. Πραγματικό κέρδος. Ρεύμα, νερό, καθαρισμός, όλα υπολογισμένα αυτόματα.",
  keywords: ["Airbnb", "profit tracking", "booking management", "vacation rental", "SimplyTouch", "host tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="el" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${dmSans.variable} antialiased font-sans`}
        >
          <ThemeProvider>
            <LanguageProvider>
              <PropertyProvider>
                {children}
              </PropertyProvider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
