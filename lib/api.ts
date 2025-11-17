import { SalaryInput } from "@/app/[locale]/components/Calculator/CalculatorForm";
import { SalaryResults } from "@/types/api";

export const fetchSalary = async (input: SalaryInput, locale: string) => {
  const res = await fetch("/api/salary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, locale }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const fetchSummary = async (data: SalaryResults, locale: string) => {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, locale }),
  });

  const summary = await res.json();

  if (!res.ok) throw new Error(summary.message);

  return summary.summary;
};
