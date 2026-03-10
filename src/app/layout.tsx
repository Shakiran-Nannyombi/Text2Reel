import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#0f0518",
};

export const metadata: Metadata = {
  title: "Text2Reel | Cinematic AI Video Generator",
  description: "Transform your vision into rhythmic reels with neural AI.",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-background-dark text-[#FFD9CC]`}
      >
        {children}
      </body>
    </html>
  );
}
