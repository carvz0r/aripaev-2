// app/api/salary/route.ts
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let locale = routing.defaultLocale;
  try {
    const body = await req.json();
    locale = body?.locale || locale;
    const { type, salaryAmount, pensionRate, unemployment } = body;

    // Getting locale translator
    const t = await getTranslations({ locale, namespace: "api" });

    if (!["gross", "net", "employer"].includes(type)) {
      return NextResponse.json(
        { message: t("invalid_salary_type"), code: "invalid_salary_type" },
        { status: 400 }
      );
    }
    
    const INCOME_TAX = 0.22;
    const SOCIAL_TAX = 0.33;
    const unempEmp = unemployment ? 0.008 : 0;
    const unempWorker = unemployment ? 0.016 : 0;

    // (Estonia 2025)
    const calcTaxFree = (grossSalary: number): number => {
      const annualIncome = grossSalary * 12;
      const MAX_TAX_FREE = 654;
      const MIN_TAX_FREE = 0;
      const REDUCTION_START = 14400;
      const REDUCTION_END = 25200;

      if (annualIncome <= REDUCTION_START) return MAX_TAX_FREE;
      if (annualIncome >= REDUCTION_END) return MIN_TAX_FREE;

      const reduction =
        MAX_TAX_FREE *
        (1 -
          (annualIncome - REDUCTION_START) / (REDUCTION_END - REDUCTION_START));
      return Math.max(reduction, 0);
    };

    const calcIncomeTax = (
      grossSalary: number,
      pensionRate: number,
      unempWorkerRate: number
    ): number => {
      const taxFree = calcTaxFree(grossSalary);
      const taxableBase = Math.max(
        grossSalary -
          grossSalary * pensionRate -
          grossSalary * unempWorkerRate -
          taxFree,
        0
      );
      return taxableBase * INCOME_TAX;
    };

    let gross: number;
    let net: number;
    let employer: number;

    if (type === "net") {
      // Net → Gross
      let guess = salaryAmount;
      for (let i = 0; i < 20; i++) {
        const tax = calcIncomeTax(guess, pensionRate, unempWorker);
        const newGuess =
          salaryAmount + tax + guess * pensionRate + guess * unempWorker;
        if (Math.abs(newGuess - guess) < 0.01) break;
        guess = newGuess;
      }
      gross = guess;
      net = salaryAmount;
      employer = gross * (1 + SOCIAL_TAX + unempEmp);
    } else if (type === "gross") {
      // Gross → Net
      gross = salaryAmount;
      const incomeTax = calcIncomeTax(gross, pensionRate, unempWorker);
      net = gross - incomeTax - gross * pensionRate - gross * unempWorker;
      employer = gross * (1 + SOCIAL_TAX + unempEmp);
    } else {
      // Employer → Gross + Net
      employer = salaryAmount;
      gross = employer / (1 + SOCIAL_TAX + unempEmp);
      const incomeTax = calcIncomeTax(gross, pensionRate, unempWorker);
      net = gross - incomeTax - gross * pensionRate - gross * unempWorker;
    }

    const socialTax = gross * SOCIAL_TAX;
    const unempEmpTax = gross * unempEmp;
    const pension = gross * pensionRate;
    const unempWorkerTax = gross * unempWorker;
    const incomeTax = calcIncomeTax(gross, pensionRate, unempWorker);
    const taxFree = calcTaxFree(gross);

    const breakdown = {
      employerCost: employer,
      socialTax,
      unemploymentEmployer: unempEmpTax,
      gross,
      pension,
      unemploymentEmployee: unempWorkerTax,
      incomeTax,
      net,
      taxFree,
      percents: {
        gross: 100,
        pension: +((pension / gross) * 100).toFixed(2),
        unemploymentEmployee: +((unempWorkerTax / gross) * 100).toFixed(2),
        incomeTax: +((incomeTax / gross) * 100).toFixed(2),
        socialTax: +((socialTax / gross) * 100).toFixed(2),
        unemploymentEmployer: +((unempEmpTax / gross) * 100).toFixed(2),
        employerCost: +((employer / gross) * 100).toFixed(2),
        net: +((net / gross) * 100).toFixed(2),
      },
    };

    return NextResponse.json({
      net: Math.round(net * 100) / 100,
      gross: Math.round(gross * 100) / 100,
      employer: Math.round(employer * 100) / 100,
      breakdown,
    });
  } catch (error) {
    console.error("Calculation error:", error);

    // Getting locale translator
    const t = await getTranslations({ locale, namespace: "api" });

    return NextResponse.json(
      {
        message: t("calculation_failed"),
        code: "calculation_failed",
      },
      { status: 500 }
    );
  }
}
