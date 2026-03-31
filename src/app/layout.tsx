import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { IntroLoader } from "@/components/intro-loader";
import { ThemeProvider } from "@/components/theme-provider";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  /** 500–700 cover site usage (medium → bold); omit 800 to save a font file. */
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Akash - Product Designer (6+yrs)",
  description:
    "B2B product design for AI-assisted workflows, design systems at scale, and accessible enterprise software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider>
          <IntroLoader>{children}</IntroLoader>
          <CustomCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
