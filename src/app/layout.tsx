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
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.googleusercontent.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com; media-src 'self' https://d8j0ntlcm91z4.cloudfront.net;"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
