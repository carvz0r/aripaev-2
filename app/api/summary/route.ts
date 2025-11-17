// app/api/summary/route.ts
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import OpenAI from "openai";
import { AVAILABLE_LOCALES } from "@/i18n/routing";

export async function POST(req: Request) {
  let locale = "en";
  try {
    const body = await req.json().catch(() => null);
    const { net, gross, employer } = body;
    locale = body?.locale || locale;

    // Getting locale translator
    const t = await getTranslations({ locale, namespace: "api" });

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: t("invalid_body"), code: "invalid_body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          message: t("missing_api_key"),
          code: "missing_api_key",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    if (
      typeof net !== "number" ||
      typeof gross !== "number" ||
      typeof employer !== "number"
    ) {
      return NextResponse.json(
        { message: t("invalid_salary"), code: "invalid_salary" },
        { status: 400 }
      );
    }

    const localeObj = AVAILABLE_LOCALES.find((l) => l.value === locale);
    const languageName = localeObj?.label || "English";

    const prompt = `
This data refers to Estonia:
- Net salary: €${net}
- Gross salary: €${gross}
- Employer total cost: €${employer}

Based on this salary, classify it as:
- low (approx. 0–2000€ net/month)
- medium (2000–4000€)
- high (4000–8000€)
- very high (8000€+)

Write a short summary in ${languageName} (3–4 sentences):
1. Explain what kind of lifestyle this salary provides in Estonia.
2. Mention the current salary growth trend in Estonia (is it increasing or stable?).
3. Suggest realistic skills, industries, or strategies to increase income, tailored to this salary level.
Keep it concise, factual, and culturally relevant.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const model = process.env.OPEN_API_MODEL || "gpt-4o-mini";

    const completion = await client.chat.completions.create(
      {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 250,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const summary = completion.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summary API error:", error);

    const t = await getTranslations({ locale, namespace: "api" });

    if (error.status === 429 || error.code === "insufficient_quota") {
      return NextResponse.json(
        {
          message: t("insufficient_quota"),
          code: "insufficient_quota",
        },
        { status: 429 }
      );
    }

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          message: t("timeout"),
          code: "timeout",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        message: t("summary_unexpected"),
        code: "summary_unexpected",
      },
      { status: 500 }
    );
  }
}
