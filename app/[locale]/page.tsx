import { TypographyH1 } from "@/components/ui/h1";
import Calculator from "./components/Calculator";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen items-center justify-center font-sans text-gray-700 dark:text-gray-300" style={{background: 'var(--background)'}}>
      <main className="flex min-h-screen w-full md:max-w-5xl flex-col items-center sm:items-start shadow-xl shadow-gray-200 gap-16 px-8 py-10 md:py-20 md:px-16" style={{background: 'var(--card)', boxShadow: "0 20px 25px -5px var(--shadow)"}}>
        <div className="flex xs:flex-col sm:flex-col md:flex-row items-center md:justify-between w-full gap-8">
          <TypographyH1>🇪🇪 {t("title")}</TypographyH1>
          <LocaleSwitcher />
        </div>
        <Calculator />
      </main>
    </div>
  );
}
