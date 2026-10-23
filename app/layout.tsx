import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";
import { invitation } from "./invitation.config";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const names = invitation.hosts.join(" & ");

export const metadata: Metadata = {
  title: `${names} · You're Invited`,
  description: `${invitation.title} — ${invitation.venue.name}. Tap to watch the invitation.`,
};

export const viewport: Viewport = {
  themeColor: "#2a0a14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
