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
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { LoadingState } from "./Calculator";

export interface SalaryInput {
  type: "gross" | "employer" | "net";
  salaryAmount: number;
  pensionRate: number;
  unemployment: boolean;
}

interface Props {
  onCalculate: (input: SalaryInput) => void;
  loading: LoadingState;
}

export default function CalculatorForm({ onCalculate, loading }: Props) {
  const [inputType, setInputType] = useState<"gross" | "employer" | "net">(
    "gross"
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [pension, setPension] = useState("0.02");
  const [unemployment, setUnemployment] = useState(true);

  const t = useTranslations("Calculator");

  const handleSubmit = () => {
    if (!inputValue) return;
    onCalculate({
      type: inputType,
      salaryAmount: Number(inputValue),
      pensionRate: Number(pension),
      unemployment,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <FieldSet>
        <FieldGroup className="flex flex-col gap-4 py-8">
          <Field>
            <FieldLabel htmlFor="inputType">{t("Salary type")}</FieldLabel>
            <Select
              value={inputType}
              onValueChange={(v) => setInputType(v as SalaryInput["type"])}
            >
              <SelectTrigger id="inputType">
                <SelectValue placeholder={"Choose"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gross">
                  {t("Gross salary")} ({t("before tax")})
                </SelectItem>
                <SelectItem value="employer">
                  {t("Employer cost")} ({t("employer's expense")})
                </SelectItem>
                <SelectItem value="net">
                  {t("Net salary")} ({t("after tax")})
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              {t(
                "Select whether you want to input net, gross or employer cost"
              )}
              .
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">{t("Salary")} (€)</FieldLabel>
            <Input
              id="amount"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("e_g") + " 1800"}
            />
            <FieldDescription>
              {t("Enter the amount corresponding to the selected input type")}.
            </FieldDescription>
          </Field>

          <Field
            orientation="horizontal"
            className="justify-between items-center"
          >
            <FieldLabel htmlFor="pension">
              {t("Pension contribution")}
            </FieldLabel>
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
              {t("Unemployment insurance")}
            </FieldLabel>
          </Field>

          <Field>
            <Button
              className="w-full mt-3"
              onClick={handleSubmit}
              disabled={loading !== "idle"}
            >
              {loading === "salary"
                ? t("Calculating") + "..."
                : loading === "summary"
                ? t("Generating summary") + "..."
                : t("Calculate")}
              {loading !== "idle" ? <Spinner /> : <></>}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
