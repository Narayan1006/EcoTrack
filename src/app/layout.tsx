import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoTrack — Carbon Footprint Awareness Platform',
  description:
    'Track, understand, and reduce your carbon footprint with AI-powered insights powered by Google Gemini. Built for Google PromptWars Challenge 3.',
  keywords: ['carbon footprint', 'sustainability', 'eco tracker', 'climate action', 'CO2 calculator', 'Google Gemini'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
