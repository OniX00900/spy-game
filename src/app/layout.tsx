import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Spy Game",
  description: "Spy Game",
};

export default function RootLayout({
  children,
}: {
   children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <body>
        <ThemeProvider>
          <Header />
          {/* Глобальный контейнер для всего контента страниц */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-65px)]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}