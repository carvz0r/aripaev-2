import type { Metadata } from "next";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Aripaev Test Work",
  description: "Salary Calculator",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className="antialiased font-sans text-gray-700 dark:text-gray-300">
        <ThemeProvider attribute="class" defaultTheme="system">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
