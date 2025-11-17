import { useLocale } from "next-intl";
import { AVAILABLE_LOCALES } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect"; // Новый компонент на Radix

export default function LocaleSwitcher() {
  const locale = useLocale();
  const options = AVAILABLE_LOCALES;
  return <LocaleSwitcherSelect defaultValue={locale} options={options} />;
}
