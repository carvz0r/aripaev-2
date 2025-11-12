import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalaryBreakdown {
  employerCost: number;
  socialTax: number;
  unemploymentEmployer: number;
  gross: number;
  pension: number;
  unemploymentEmployee: number;
  incomeTax: number;
  net: number;
}

interface SalaryResultTableProps {
  breakdown: SalaryBreakdown;
}

export default function SalaryResultTable({
  breakdown,
}: SalaryResultTableProps) {
  const rows = [
    {
      label: "💼 Total Employer Cost",
      eur: breakdown.employerCost,
      percent: "100%",
    },
    {
      label: "Social Tax (employer)",
      eur: breakdown.socialTax,
      percent: "33%",
    },
    {
      label: "Unemployment Insurance (employer)",
      eur: breakdown.unemploymentEmployer,
      percent: "0.8%",
    },
    {
      label: "Gross Salary",
      eur: breakdown.gross,
      percent: "-",
    },
    {
      label: "Pension Fund (II pillar, 2%)",
      eur: breakdown.pension,
      percent: "2%",
    },
    {
      label: "Unemployment Insurance (employee)",
      eur: breakdown.unemploymentEmployee,
      percent: "1.6%",
    },
    {
      label: "Income Tax",
      eur: breakdown.incomeTax,
      percent: "22%",
    },
    {
      label: "💰 Net Salary",
      eur: breakdown.net,
      percent: "-",
      Highlighted: true,
    },
  ];

  return (
    <div className="overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold"></TableHead>
            <TableHead className="text-right font-semibold">EUR</TableHead>
            <TableHead className="text-right font-semibold">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              className={`${idx % 2 !== 1 ? "bg-blue-50/25" : ""} ${
                row.Highlighted ? "font-bold" : ""
              } hover:bg-muted/40`}
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
