import { TypographyH3 } from "@/components/ui/h3";
import { useTranslations } from "next-intl";

interface Props {
  summary?: string;
}

export default function Summary({ summary }: Props) {
  const t = useTranslations("Summary");

  return (
    <div
      className="mt-6 p-5 rounded relative overflow-hidden"
      style={{ background: "var(--heading-background-3)" }}
    >
      <div
        className="absolute w-70 h-48 top-[-195] left-[-60] rotate-[-5deg]"
        style={{ background: "var(--card)" }}
      />
      <div
        className="absolute w-70 h-48 top-[-180] right-[-60] rotate-[5deg]"
        style={{ background: "var(--card)" }}
      />
      <TypographyH3>{t("title")}:</TypographyH3>
      <div className="space-y-4 text-sm leading-relaxed">
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
