import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Aripaev Test Work",
  description: "Salary Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head/>
      <body
        className="antialiased font-sans text-gray-700 dark:text-gray-300"
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
