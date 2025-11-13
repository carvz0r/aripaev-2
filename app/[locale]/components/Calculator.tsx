"use client";

import { useState } from "react";
import { TypographyH2 } from "@/components/ui/h2";
import SalaryResultTable from "./SalaryResultTable";
import { useLocale, useTranslations } from "next-intl";
import Summary from "./Summary";
import CalculatorForm, { SalaryInput } from "./CalculatorForm";


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
        net: 0
      }
    },
  });
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<LoadingState>("idle");
  const locale = useLocale();

  const handleCalculate = async (input: SalaryInput) => {
    setLoading("salary");
    try {
      const res = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      setResult(data);
      setLoading("summary");
      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary);
    } finally {
      setLoading("idle");
    }
  };

  const t = useTranslations("Calculator");

  return (
    <div className="flex w-full xs:flex-col sm:flex-col md:flex-row xs:gap-8 md:gap-12">
      <div className="flex flex-col w-full lg:max-w-sm">
        <div className="bg-blue-50 p-4 rounded relative overflow-hidden">
          <TypographyH2>{t("Input")}:</TypographyH2>
          <div className="absolute w-70 h-48 bg-white bottom-[-185] right-[-50] rotate-[-5deg]" />
          <div className="absolute w-30 h-60 bg-white bottom-[-150] right-[-100] rotate-[15deg]" />
        </div>

        <CalculatorForm onCalculate={handleCalculate} loading={loading} />
      </div>
      <div className="flex flex-col w-full">
        <div className="bg-green-50 p-4 rounded relative overflow-hidden">
          <TypographyH2>{t("Results")}:</TypographyH2>
          <div className="absolute w-70 h-48 bg-white bottom-[-200] left-[-60] rotate-[9deg]" />
          <div className="absolute w-70 h-48 bg-white bottom-[-190] right-[-60] rotate-[-8deg]" />
          <div className="absolute w-30 h-60 bg-white bottom-[-100] right-[-100] rotate-[-19deg]" />
        </div>
        <div className="flex flex-col gap-6 lg:max-w-md py-6">
          <SalaryResultTable breakdown={result.breakdown} />
          <Summary summary={summary} />
        </div>
      </div>
    </div>
  );
}
