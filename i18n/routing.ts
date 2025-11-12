import { defineRouting } from "next-intl/routing";

import { Locale } from "next-intl";

export const AVAILABLE_LOCALES: {
  value: Locale;
  label: string;
  flag: string;
}[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "et", label: "Eesti", flag: "🇪🇪" },
];

export const routing = defineRouting({
  locales: AVAILABLE_LOCALES.map((locale) => locale.value),
  defaultLocale: "et",
});
