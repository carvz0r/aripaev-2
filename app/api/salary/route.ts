// app/api/calc/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { type, salaryAmount, pensionRate, unemployment } = body;

  const INCOME_TAX = 0.22;
  const SOCIAL_TAX = 0.33;
  const unempEmp = unemployment ? 0.008 : 0;
  const unempWorker = unemployment ? 0.016 : 0;
  const TAX_FREE = 654;

  const calcIncomeTax = (grossSalary: number) => {
    const taxable = Math.max(grossSalary - TAX_FREE, 0);
    return taxable * INCOME_TAX;
  };

  let net: number;
  let gross: number;
  let employer: number;

  if (type === "net") {
    //Net
    let guess = salaryAmount;
    for (let i = 0; i < 10; i++) {
      const incomeTax = calcIncomeTax(guess);
      const prev = guess;
      guess =
        salaryAmount + incomeTax + guess * pensionRate + guess * unempWorker;
      if (Math.abs(prev - guess) < 0.01) break;
    }
    gross = guess;
    net = salaryAmount;
    employer = gross * (1 + SOCIAL_TAX + unempEmp);
  } else if (type === "gross") {
    //Gross
    gross = salaryAmount;
    const incomeTax = calcIncomeTax(gross);
    net = gross - incomeTax - gross * pensionRate - gross * unempWorker;
    employer = gross * (1 + SOCIAL_TAX + unempEmp);
  } else if (type === "employer") {
    //Employer
    employer = salaryAmount;
    gross = employer / (1 + SOCIAL_TAX + unempEmp);
    const incomeTax = calcIncomeTax(gross);
    net = gross - incomeTax - gross * pensionRate - gross * unempWorker;
  } else {
    return NextResponse.json(
      { error: "Invalid salary type", code: "invalid_type" },
      { status: 400 }
    );
  }

  const socialTax = gross * SOCIAL_TAX;
  const unempEmpTax = gross * unempEmp;
  const pension = gross * pensionRate;
  const unempWorkerTax = gross * unempWorker;
  const incomeTax = calcIncomeTax(gross);

  return NextResponse.json({
    net: Math.round(net),
    gross: Math.round(gross),
    employer: Math.round(employer),
    breakdown: {
      employerCost: employer,
      socialTax,
      unemploymentEmployer: unempEmpTax,
      gross,
      pension,
      unemploymentEmployee: unempWorkerTax,
      incomeTax,
      net,
    },
  });
}
