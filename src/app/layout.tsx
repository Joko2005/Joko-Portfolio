import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Intro } from "@/components/shell/Intro";
import { Shell } from "@/components/shell/Shell";
import { site } from "@/content/site";
import "./globals.css";

// One OFL family (free for commercial use): Funnel Sans for text/UI, Funnel Display for headings.
const funnelSans = Funnel_Sans({ subsets: ["latin"], variable: "--font-funnel-sans", display: "swap" });
const funnelDisplay = Funnel_Display({ subsets: ["latin"], variable: "--font-funnel-display", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: `${site.role}. ${site.statement}`,
};

// Runs before paint so repeat visitors and reduced-motion users never see the intro flash.
const introScript = `try{if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${funnelSans.variable} ${funnelDisplay.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Intro name={site.name} />
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
