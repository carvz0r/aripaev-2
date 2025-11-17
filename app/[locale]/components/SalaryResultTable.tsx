import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { SalaryBreakdown } from "./Calculator";

interface SalaryResultTableProps {
  breakdown: SalaryBreakdown;
}

export default function SalaryResultTable({
  breakdown,
}: SalaryResultTableProps) {
  const t = useTranslations("CalculatorResults");

  const percents = breakdown.percents;

  const rows = [
    {
      label: "💼 " + t("Total Employer Cost"),
      eur: breakdown.employerCost,
      percent: `${percents.employerCost}%`,
    },
    {
      label: t("Social Tax (employer)"),
      eur: breakdown.socialTax,
      percent: `${percents.socialTax}%`,
    },
    {
      label: t("Unemployment Insurance (employer)"),
      eur: breakdown.unemploymentEmployer,
      percent: `${percents.unemploymentEmployer}%`,
    },
    {
      label: t("Gross Salary"),
      eur: breakdown.gross,
      percent: `${percents.gross}%`,
    },
    {
      label: t("Tax Free"),
      eur: breakdown.taxFree,
      percent: "-",
    },
    {
      label: t("Pension Fund (II pillar, 2%)"),
      eur: breakdown.pension,
      percent: `${percents.pension}%`,
    },
    {
      label: t("Unemployment Insurance (employee)"),
      eur: breakdown.unemploymentEmployee,
      percent: `${percents.unemploymentEmployee}%`,
    },
    {
      label: t("Income Tax"),
      eur: breakdown.incomeTax,
      percent: `${percents.incomeTax}%`,
    },
    {
      label: "💰 " + t("Net Salary"),
      eur: breakdown.net,
      percent: `${percents.net}%`,
      Highlighted: true,
    },
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
                {Math.round(row.eur).toLocaleString("et-EE")}
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
