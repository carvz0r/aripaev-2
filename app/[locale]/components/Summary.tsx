import { TypographyH3 } from "@/components/ui/h3";
import { useTranslations } from "next-intl";

interface Props {
  summary?: string;
}

export default function Summary({ summary }: Props) {
  const t = useTranslations("Summary");

  return (
    <div className="mt-6 bg-yellow-50 p-5 rounded relative overflow-hidden">
      <div className="absolute w-70 h-48 bg-white top-[-195] left-[-60] rotate-[-5deg]" />
      <div className="absolute w-70 h-48 bg-white top-[-180] right-[-60] rotate-[5deg]" />
      <TypographyH3>{t("title")}:</TypographyH3>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {summary ? (
          summary
        ) : (
          <>
            <p>{t("intro1")}</p>

            <p>{t("intro2")}</p>

            <p>{t("beforeList")}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("list.netSalary")}</li>
              <li>{t("list.taxes")}</li>
              <li>{t("list.totalCost")}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
