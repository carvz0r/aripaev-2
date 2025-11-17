"use client";

import { useState } from "react";
import { TypographyH2 } from "@/components/ui/h2";
import SalaryResultTable from "./SalaryResultTable";
import Summary from "./Summary";
import CalculatorForm, { SalaryInput } from "./CalculatorForm";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { fetchSalary, fetchSummary } from "@/lib/api";

export interface SalaryBreakdownPercents {
  employerCost: number;
  socialTax: number;
  unemploymentEmployer: number;
  gross: number;
  pension: number;
  unemploymentEmployee: number;
  incomeTax: number;
  net: number;
}

export interface SalaryBreakdown {
  employerCost: number;
  socialTax: number;
  unemploymentEmployer: number;
  gross: number;
  pension: number;
  unemploymentEmployee: number;
  incomeTax: number;
  net: number;
  taxFree: number;
  percents: SalaryBreakdownPercents;
}

interface SalaryResult {
  net: number;
  gross: number;
  employer: number;
  breakdown: SalaryBreakdown;
}

export type LoadingState = "idle" | "salary" | "summary";

export default function Calculator() {
  const [result, setResult] = useState<SalaryResult>({
    net: 0,
    gross: 0,
    employer: 0,
    breakdown: {
      employerCost: 0,
      socialTax: 0,
      unemploymentEmployer: 0,
      gross: 0,
      pension: 0,
      unemploymentEmployee: 0,
      incomeTax: 0,
      net: 0,
      taxFree: 0,
      percents: {
        employerCost: 0,
        socialTax: 0,
        unemploymentEmployer: 0,
        gross: 0,
        pension: 0,
        unemploymentEmployee: 0,
        incomeTax: 0,
        net: 0,
      },
    },
  });
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<LoadingState>("idle");
  const locale = useLocale();

  const handleCalculate = async (input: SalaryInput) => {
    setLoading("salary");
    try {
      const salaryData = await fetchSalary(input);
      setResult(salaryData);
      
      setLoading("summary");
      const summary = await fetchSummary(salaryData, locale);
      setSummary(summary);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading("idle");
    }
  };

  const t = useTranslations("Calculator");

  return (
    <div className="flex w-full xs:flex-col md:flex-row xs:gap-8 md:gap-12">
      <div className="flex flex-col w-full lg:max-w-sm">
        <div
          className="p-4 rounded relative overflow-hidden"
          style={{ background: "var(--heading-background-1)" }}
        >
          <TypographyH2>{t("Input")}:</TypographyH2>
          <div
            className="absolute w-70 h-48 bottom-[-185] right-[-50] rotate-[-5deg]"
            style={{ background: "var(--card)" }}
          />
          <div
            className="absolute w-30 h-60 bottom-[-150] right-[-100] rotate-[15deg]"
            style={{ background: "var(--card)" }}
          />
        </div>

        <CalculatorForm onCalculate={handleCalculate} loading={loading} />
      </div>
      <div className="flex flex-col w-full">
        <div
          className="p-4 rounded relative overflow-hidden"
          style={{ background: "var(--heading-background-2)" }}
        >
          <TypographyH2>{t("Results")}:</TypographyH2>
          <div
            className="absolute w-70 h-48 bottom-[-200] left-[-60] rotate-[9deg]"
            style={{ background: "var(--card)" }}
          />
          <div
            className="absolute w-70 h-48 bottom-[-190] right-[-60] rotate-[-8deg]"
            style={{ background: "var(--card)" }}
          />
          <div
            className="absolute w-30 h-60 bottom-[-100] right-[-100] rotate-[-19deg]"
            style={{ background: "var(--card)" }}
          />
        </div>
        <div className="flex flex-col gap-6 lg:max-w-md py-6">
          <SalaryResultTable breakdown={result.breakdown} />
          <Summary summary={summary} />
        </div>
      </div>
    </div>
  );
}
