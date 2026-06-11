import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiResponse } from "@/backend/gemini";

const AssistantSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = AssistantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { message, history } = parsed.data;
    const response = await getGeminiResponse(message, history);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
