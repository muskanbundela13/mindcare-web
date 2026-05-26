import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are MindCare AI.
You are a helpful, supportive, calm, and intelligent mental wellness assistant.
Your responsibilities:
- Help users with stress, anxiety, sadness, overthinking, motivation, loneliness, and productivity.
- Answer general knowledge questions too.
- Speak in a friendly and caring tone.
- Never give harmful advice.
- If someone talks about self-harm or suicide, encourage them to contact trusted people or professionals.
- Keep responses short, helpful, and human-like.
- Give practical advice.
`;

const sessionHistory: Record<string, { role: "user" | "assistant"; content: string }[]> = {};

export async function POST(req: NextRequest) {
  const { message, sessionToken } = await req.json();

  if (!message) {
    return NextResponse.json({ success: false, error: "No message" }, { status: 400 });
  }

  if (!sessionHistory[sessionToken]) {
    sessionHistory[sessionToken] = [];
  }

  const history = sessionHistory[sessionToken];
  history.push({ role: "user", content: message });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history
      ],
    });

    const reply = completion.choices[0].message.content || "I'm here for you. Can you tell me more?";
    history.push({ role: "assistant", content: reply });

    const crisisWords = ["suicide", "kill myself", "end my life", "self harm", "want to die", "hurt myself"];
    const isCrisis = crisisWords.some(w => message.toLowerCase().includes(w));

    return NextResponse.json({
      success: true,
      data: { response: reply, isCrisis }
    });

  } catch (err) {
    return NextResponse.json({
      success: true,
      data: {
        response: "I'm having trouble connecting right now. If you need immediate support, please call iCall at 9152987821.",
        isCrisis: false
      }
    });
  }
}