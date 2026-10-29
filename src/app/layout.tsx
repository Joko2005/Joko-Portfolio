import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Intro } from "@/components/shell/Intro";
import { Shell } from "@/components/shell/Shell";
import { site } from "@/content/site";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.name}` },
  description: `${site.role}. ${site.statement}`,
};

// Runs before paint so repeat visitors and reduced-motion users never see the intro flash.
const introScript = `try{if(sessionStorage.getItem("intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sora.variable} suppressHydrationWarning>
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
