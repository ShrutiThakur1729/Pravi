import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY not set. AI features will use fallback responses.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : undefined;

type AIResponse = {
  content: string;
  suggestions?: string[];
};

function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

/**
 * Process a user message and generate a response from the AI assistant (Haru)
 */
export async function processMessage(
  userId: number,
  message: string,
  previousMessages: Array<{ content: string; isUser: boolean }> = [],
): Promise<AIResponse> {
  try {
    if (!genAI) {
      throw new Error("Gemini client not initialized. API key may be missing.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "You are Haru, an AI assistant designed specifically to support neurodivergent individuals. " +
        "Your purpose is to provide helpful, understanding, and clear information about ADHD, autism, dyslexia, and other forms of neurodiversity. " +
        "Respond with empathy, patience, and practical advice. " +
        "Keep your responses concise (3-5 sentences max), clear, and well-structured. " +
        "Avoid overwhelming with too much information at once. " +
        "When appropriate, suggest 2-3 relevant follow-up options the user might want to explore. " +
        "Respond with ONLY a JSON object (no markdown fences) of the form " +
        '{"content": string, "suggestions": string[]}.',
    });

    const history = previousMessages.slice(0, -1).map((msg) => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    const parsed = extractJson(text);

    return {
      content: parsed.content ?? text,
      suggestions: parsed.suggestions ?? [],
    };
  } catch (error) {
    console.error("Error processing message with Gemini:", error);
    return {
      content: "I'm having trouble connecting right now. Please try again in a moment.",
      suggestions: ["Ask about ADHD strategies", "Help with anxiety", "Learning techniques"],
    };
  }
}

/**
 * Generate a personalized learning recommendation
 */
export async function generateLearningRecommendations(
  userId: number,
  interests: string[],
): Promise<any> {
  try {
    if (!genAI) {
      throw new Error("Gemini client not initialized. API key may be missing.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt =
      `You are an educational assistant for neurodivergent individuals. Generate 3 personalized learning module ` +
      `recommendations for a user interested in: ${interests.join(", ")}. ` +
      `Respond with ONLY a JSON object (no markdown fences) of the form ` +
      `{"recommendations": [{"title": string, "description": string, "benefits": string}]}.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return extractJson(text);
  } catch (error) {
    console.error("Error generating learning recommendations:", error);
    return {
      recommendations: [
        {
          title: "Executive Function Skills",
          description: "Develop strategies for organization, time management and task completion",
          benefits: "Improve daily productivity and reduce stress from disorganization",
        },
      ],
    };
  }
}

/**
 * Generate coping strategies for emotions
 */
export async function generateCopingStrategies(emotion: string): Promise<any> {
  try {
    if (!genAI) {
      throw new Error("Gemini client not initialized. API key may be missing.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt =
      `You are a supportive coach specializing in emotional regulation for neurodivergent individuals. ` +
      `Generate 3 coping strategies for when someone is feeling ${emotion}. The strategies should be neurodivergent-friendly. ` +
      `Respond with ONLY a JSON object (no markdown fences) of the form ` +
      `{"strategies": [{"title": string, "description": string, "steps": string[]}]}.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return extractJson(text);
  } catch (error) {
    console.error("Error generating coping strategies:", error);
    return {
      strategies: [
        {
          title: "Deep Breathing",
          description: "A simple breathing technique to calm the nervous system",
          steps: ["Breathe in for 4 seconds", "Hold for 2 seconds", "Exhale for 6 seconds", "Repeat 5 times"],
        },
      ],
    };
  }
}
