import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { net, gross, employer } = await req.json();

  const prompt = `
  This data refers to Estonia:
  - Net salary: €${net}
  - Gross salary: €${gross}
  - Employer total cost: €${employer}

  Write a short summary in English (3–4 sentences):
  1. Explain the approximate standard of living in Estonia with this salary.
  2. Mention the current salary growth trend in Estonia (is it increasing or stable?).
  3. Suggest skills or industries that could help increase this salary.
  Keep it concise and easy to understand.
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const summary = completion.choices[0]?.message?.content || "No summary available.";

  return NextResponse.json({ summary });
}
