export interface SalaryResults {
  employerCost: number;
  socialTax: number;
  unemploymentEmployer: number;
  gross: number;
  pension: number;
  unemploymentEmployee: number;
  incomeTax: number;
  net: number;
  taxFree: number;
  percents: SalaryPercents;
}

export interface SalaryPercents {
  gross: number;
  pension: number;
  unemploymentEmployee: number;
  incomeTax: number;
  socialTax: number;
  unemploymentEmployer: number;
  employerCost: number;
  net: number;
}

export interface SummaryRequestBody {
  net: number;
  gross: number;
  employerCost: number;
  locale?: string;
}