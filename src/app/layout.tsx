import type { Metadata } from "next";
import { Jua, Luckiest_Guy } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
  display: "swap",
});

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kheelona | Smartest Playmates for Brightest Minds",
  description:
    "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages. Pre-order now!",
  keywords: [
    "AI toy",
    "educational toy",
    "talking toy",
    "Lumi",
    "Kheelona",
    "children toy",
    "screen-free toy",
    "learning toy",
    "smart toy",
  ],
  authors: [{ name: "Kheelona Robotics" }],
  creator: "Kheelona Robotics",
  publisher: "Kheelona Robotics",
  openGraph: {
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description:
      "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages.",
    url: "https://kheelona.com",
    siteName: "Kheelona",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description:
      "Meet Lumi - The most intelligent AI-powered talking toy for your child.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${luckiestGuy.variable} ${jua.variable}`} suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
