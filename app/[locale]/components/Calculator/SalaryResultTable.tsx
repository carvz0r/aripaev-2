import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalaryResults } from "@/types/api";
import { useTranslations } from "next-intl";

interface SalaryResultTableProps {
  results: SalaryResults;
}

export default function SalaryResultTable({
  results,
}: SalaryResultTableProps) {
  const t = useTranslations("CalculatorResults");

  const {
    employerCost,
    socialTax,
    unemploymentEmployer,
    gross,
    taxFree,
    pension,
    unemploymentEmployee,
    incomeTax,
    net,
    percents,
  } = results;

   const rows = [
    { label: "💼 " + t("Total Employer Cost"), eur: employerCost, percent: `${percents.employerCost}%` },
    { label: t("Social Tax (employer)"), eur: socialTax, percent: `${percents.socialTax}%` },
    { label: t("Unemployment Insurance (employer)"), eur: unemploymentEmployer, percent: `${percents.unemploymentEmployer}%` },
    { label: t("Gross Salary"), eur: gross, percent: `${percents.gross}%` },
    { label: t("Tax Free"), eur: taxFree, percent: "-" },
    { label: t("Pension Fund (II pillar, 2%)"), eur: pension, percent: `${percents.pension}%` },
    { label: t("Unemployment Insurance (employee)"), eur: unemploymentEmployee, percent: `${percents.unemploymentEmployee}%` },
    { label: t("Income Tax"), eur: incomeTax, percent: `${percents.incomeTax}%` },
    { label: "💰 " + t("Net Salary"), eur: net, percent: `${percents.net}%`, Highlighted: true },
  ];
  return (
    <div className="overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold"></TableHead>
            <TableHead className="text-right font-semibold">
              {t("EUR")}
            </TableHead>
            <TableHead className="text-right font-semibold">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              className={`${idx % 2 !== 1 ? "bg-blue-50/25" : ""} ${
                row.Highlighted ? "font-bold" : ""
              } hover:bg-muted/40 dark:hover:bg-muted/90`}
            >
              <TableCell>{row.label}</TableCell>
              <TableCell
                className={`text-right ${
                  row.Highlighted ? "font-bold" : "font-medium"
                }`}
              >
                {row.eur.toLocaleString("et-EE")}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {row.percent}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
