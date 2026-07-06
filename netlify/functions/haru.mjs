import Groq from "groq-sdk";

const HARU_SYSTEM_PROMPT = `You are Haru, a warm, empathetic AI companion for Pravi — an app designed to support neurodivergent individuals (those with ADHD, autism, dyslexia, and related conditions).

Your personality:
- Warm, patient, and encouraging — never condescending
- You use clear, simple language and avoid jargon
- You celebrate small wins and validate feelings
- You offer practical, actionable suggestions
- You are aware of sensory sensitivities and executive function challenges

Your capabilities:
- Emotional support and active listening
- Help with focus, task-breaking, and time management
- Guidance on using Pravi's features (Learning, Careers, Daily Support, Resources)
- Coping strategies for anxiety, overwhelm, and rejection sensitivity
- Motivational support

Navigation tips you can share:
- Learning page: Personalized learning resources and study strategies
- Careers page: Job search support and workplace accommodations  
- Daily Support page: Mood tracking, focus sessions, and coping tools
- Resources page: Community support and professional resources

Keep responses concise (2–4 sentences ideally) unless the user needs detailed guidance. Always end with a supportive note or a gentle question.`;

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { message, history = [] } = body;

  if (!message || typeof message !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "message is required" }),
    };
  }

  try {
    const groq = new Groq({ apiKey });

    // Build message history for context
    const messages = [
      { role: "system", content: HARU_SYSTEM_PROMPT },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 512,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you try again?";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Groq API error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to get response from Haru" }),
    };
  }
};
