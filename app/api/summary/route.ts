import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { net, gross, employer, locale } = body;

    if (
      typeof net !== "number" ||
      typeof gross !== "number" ||
      typeof employer !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid or missing salary data" },
        { status: 400 }
      );
    }

    const langMap: Record<string, string> = {
      ru: "Russian",
      et: "Estonian",
      en: "English",
    };
    const languageName = langMap[locale] || "English";

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
3. Suggest realistic skills, industries, or strategies to increase income, tailored to this salary level (avoid generic advice if the salary is already high or very high).

Keep it concise, factual, and culturally relevant.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const model = process.env.OPEN_API_MODEL
      ? process.env.OPEN_API_MODEL
      : "gpt-4o-mini";
    const completion = await client.chat.completions.create(
      {
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 250,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const summary =
      completion.choices?.[0]?.message?.content?.trim() ||
      (languageName === "Russian"
        ? "Не удалось получить сводку. Попробуйте позже."
        : languageName === "Estonian"
        ? "Kokkuvõtte saamine ebaõnnestus. Proovige hiljem uuesti."
        : "Could not generate summary. Please try again later.");

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summary API error:", error);

    if (error.status === 429 || error.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error: "OpenAI API limit reached — please try again later.",
          code: "insufficient_quota",
        },
        { status: 429 }
      );
    }

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "The request took too long to complete. Please try again later.",
        },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while generating the summary. Please try again later.",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message || JSON.stringify(error),
        }),
      },
      { status: 500 }
    );
  }
}
