"use client";

import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/h2";
import SalaryResultTable from "./SalaryResultTable";
import { TypographyH3 } from "@/components/ui/h3";

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

interface SalaryResult {
  net: number;
  gross: number;
  employer: number;
  breakdown: SalaryBreakdown;
}

export default function Calculator() {
  const [inputType, setInputType] = useState<"net" | "gross" | "employer">(
    "net"
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [pension, setPension] = useState("0.02");
  const [unemployment, setUnemployment] = useState(true);
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
    },
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setLoading(true);
    try {
      const salaryRes = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [inputType]: Number(inputValue),
          pensionRate: Number(pension),
          unemployment,
        }),
      });

      const data: SalaryResult = await salaryRes.json();
      setResult(data);

      //   const summaryRes = await fetch("/api/summary", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(data),
      //   });

      //   const summaryData = await summaryRes.json();
      //   setSummary(summaryData.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full xs:flex-col sm:flex-col md:flex-row xs:gap-8 md:gap-12">
      <div className="flex flex-col w-full max-w-sm">
        <div className="bg-blue-50 p-4 rounded relative overflow-hidden">
          <TypographyH2>Input:</TypographyH2>
          <div className="absolute w-70 h-48 bg-white bottom-[-185] right-[-50] rotate-[-5deg]" />
          <div className="absolute w-30 h-60 bg-white bottom-[-150] right-[-100] rotate-[15deg]" />
        </div>

        <FieldSet>
          <FieldGroup className="flex flex-col gap-4 py-8">
            {/* Input Type */}
            <Field>
              <FieldLabel htmlFor="inputType">Salary type</FieldLabel>
              <Select
                value={inputType}
                onValueChange={(v) => setInputType(v as any)}
              >
                <SelectTrigger id="inputType">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net">Net salary (pärast makse)</SelectItem>
                  <SelectItem value="gross">
                    Gross salary (enne makse)
                  </SelectItem>
                  <SelectItem value="employer">
                    Employer cost (tööandja kulu)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Select whether you want to input net, gross or employer cost.
              </FieldDescription>
            </Field>

            {/* Amount */}
            <Field>
              <FieldLabel htmlFor="amount">Amount (€)</FieldLabel>
              <Input
                id="amount"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 1800"
              />
              <FieldDescription>
                Enter the amount corresponding to the selected input type.
              </FieldDescription>
            </Field>

            {/* Pension */}
            <Field
              orientation="horizontal"
              className="justify-between items-center"
            >
              <FieldLabel htmlFor="pension">Pension contribution</FieldLabel>
              <Select value={pension} onValueChange={setPension}>
                <SelectTrigger id="pension" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.02">2%</SelectItem>
                  <SelectItem value="0.04">4%</SelectItem>
                  <SelectItem value="0.06">6%</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Unemployment Insurance */}
            <Field
              orientation="horizontal"
              className="justify-between items-center"
            >
              <Switch
                id="unemployment"
                checked={unemployment}
                onCheckedChange={setUnemployment}
              />
              <FieldLabel htmlFor="unemployment">
                Unemployment insurance
              </FieldLabel>
            </Field>

            {/* Calculate Button */}
            <Field>
              <Button
                className="w-full mt-3"
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
      <div className="flex flex-col w-full">
        <div className="bg-green-50 p-4 rounded relative overflow-hidden">
          <TypographyH2>Results:</TypographyH2>
          <div className="absolute w-70 h-48 bg-white bottom-[-200] left-[-60] rotate-[9deg]" />
          <div className="absolute w-70 h-48 bg-white bottom-[-190] right-[-60] rotate-[-8deg]" />
          <div className="absolute w-30 h-60 bg-white bottom-[-100] right-[-100] rotate-[-19deg]" />
        </div>
        <div className="flex flex-col gap-6 max-w-md py-6">
          <SalaryResultTable breakdown={result.breakdown} />
          <div>
            <div className="mt-6 bg-yellow-50 p-4 rounded relative overflow-hidden">
              <div className="absolute w-70 h-48 bg-white top-[-195] left-[-60] rotate-[-5deg]" />
              <div className="absolute w-70 h-48 bg-white top-[-180] right-[-60] rotate-[5deg]" />
              <TypographyH3>Summary</TypographyH3>
              <p>{summary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
