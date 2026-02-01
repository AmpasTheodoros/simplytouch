import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProfitBnB - Γνώρισε το πραγματικό σου κέρδος ανά κράτηση",
  description: "Η πλατφόρμα που δείχνει το πραγματικό κέρδος ανά κράτηση. Όχι έσοδα. Πραγματικό κέρδος. Ρεύμα, νερό, καθαρισμός, όλα υπολογισμένα αυτόματα.",
  keywords: ["Airbnb", "profit tracking", "booking management", "vacation rental", "ProfitBnB", "host tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="el">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
