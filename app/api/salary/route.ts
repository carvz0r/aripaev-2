// app/api/calc/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { net, gross, employer, pensionRate, unemployment } = body;

  const INCOME_TAX = 0.22;
  const SOCIAL_TAX = 0.33;
  const unempEmp = unemployment ? 0.008 : 0;
  const unempWorker = unemployment ? 0.016 : 0;

  const TAX_FREE = 654;

  let g = gross;
  let n = net;
  let e = employer;

  const calcIncomeTax = (grossSalary: number) => {
    const taxable = Math.max(grossSalary - TAX_FREE, 0);
    return taxable * INCOME_TAX;
  };

  // net -> gross
  if (n && !g) {
    let guess = n;
    for (let i = 0; i < 10; i++) {
      const tax = calcIncomeTax(guess);
      const prev = guess;
      guess = n + tax + guess * pensionRate + guess * unempWorker;
      if (Math.abs(prev - guess) < 0.01) break;
    }
    g = guess;
  }

  // gross -> net
  if (g && !n) {
    const incomeTax = calcIncomeTax(g);
    n = g - incomeTax - g * pensionRate - g * unempWorker;
  }

  // gross -> employer cost
  if (g && !e) {
    e = g * (1 + SOCIAL_TAX + unempEmp);
  }

  // employer cost -> gross & net
  if (e && !g) {
    g = e / (1 + SOCIAL_TAX + unempEmp);
    const incomeTax = calcIncomeTax(g);
    n = g - incomeTax - g * pensionRate - g * unempWorker;
  }

  // All calculations
  const socialTax = g * SOCIAL_TAX;
  const unempEmpTax = g * unempEmp;
  const pension = g * pensionRate;
  const unempWorkerTax = g * unempWorker;
  const incomeTax = calcIncomeTax(g);

  return NextResponse.json({
    net: Math.round(n),
    gross: Math.round(g),
    employer: Math.round(e),
    breakdown: {
      employerCost: e,
      socialTax,
      unemploymentEmployer: unempEmpTax,
      gross: g,
      pension,
      unemploymentEmployee: unempWorkerTax,
      incomeTax,
      net: n,
    },
  });
}
