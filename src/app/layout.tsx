import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/ui/contexts/AuthContext";

export const metadata: Metadata = {
  title: "EcoTrack — Carbon Footprint Awareness Platform",
  description:
    "Track, understand, and reduce your carbon footprint with AI-powered insights. Built for Google PromptWars Challenge 3.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "eco tracker",
    "climate action",
    "CO2 calculator",
    "Google Gemini",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
