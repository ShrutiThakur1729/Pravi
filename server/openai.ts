import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Initialize with fallback for development, but will use real API key when provided
let openai: OpenAI;
try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (error) {
  console.warn("OpenAI initialization failed. Using mock responses until API key is provided.");
  // Will use fallback responses from catch blocks when API calls are attempted
}

type AIResponse = {
  content: string;
  suggestions?: string[];
};

/**
 * Process a user message and generate a response from the AI assistant
 * @param userId The ID of the user sending the message
 * @param message The message content from the user
 * @param previousMessages Optional array of previous messages for context
 * @returns Response from the AI assistant with content and suggestions
 */
export async function processMessage(userId: number, message: string, previousMessages: Array<{content: string, isUser: boolean}> = []): Promise<AIResponse> {
  try {
    // Convert previous messages to OpenAI format
    const messageHistory = previousMessages.map(msg => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.content
    }));

    // Add system message with instructions
    const systemMessage = {
      role: "system",
      content: 
        "You are Haru, an AI assistant designed specifically to support neurodivergent individuals. " +
        "Your purpose is to provide helpful, understanding, and clear information about ADHD, autism, dyslexia, and other forms of neurodiversity. " +
        "Respond with empathy, patience, and practical advice. " +
        "Keep your responses concise (3-5 sentences max), clear, and well-structured. " +
        "Avoid overwhelming with too much information at once. " +
        "When appropriate, suggest 2-3 relevant follow-up options the user might want to explore. " +
        "Format your response as a JSON object with 'content' (your main response) and 'suggestions' (array of 2-3 follow-up prompts)."
    };

    // Add current message
    const userMessage = {
      role: "user",
      content: message
    };

    // Create the full conversation context
    const messages = [
      systemMessage,
      ...messageHistory,
      userMessage
    ];

    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI client not initialized. API key may be missing.");
    }

    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const responseContent = response.choices[0].message.content;
    const parsedResponse = responseContent ? JSON.parse(responseContent) : { content: "I'm sorry, I couldn't process your request at the moment." };

    return {
      content: parsedResponse.content,
      suggestions: parsedResponse.suggestions || []
    };
  } catch (error) {
    console.error("Error processing message with OpenAI:", error);
    return {
      content: "I'm having trouble connecting right now. Please try again in a moment.",
      suggestions: ["Ask about ADHD strategies", "Help with anxiety", "Learning techniques"]
    };
  }
}

/**
 * Generate a personalized learning recommendation
 * @param userId The ID of the user to generate recommendations for
 * @param interests User's interests and challenges
 * @returns Recommendations for learning modules
 */
export async function generateLearningRecommendations(userId: number, interests: string[]): Promise<any> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI client not initialized. API key may be missing.");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an educational assistant for neurodivergent individuals. Generate personalized learning module recommendations."
        },
        {
          role: "user",
          content: `Generate 3 personalized learning module recommendations for a user interested in: ${interests.join(", ")}. Format the response as a JSON array with objects containing 'title', 'description', and 'benefits'.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const recommendations = JSON.parse(response.choices[0].message.content || "{}");
    return recommendations;
  } catch (error) {
    console.error("Error generating learning recommendations:", error);
    return { 
      recommendations: [
        {
          title: "Executive Function Skills",
          description: "Develop strategies for organization, time management and task completion",
          benefits: "Improve daily productivity and reduce stress from disorganization"
        }
      ] 
    };
  }
}

/**
 * Generate coping strategies for emotions
 * @param emotion The emotion to generate coping strategies for
 * @returns Coping strategies for the specified emotion
 */
export async function generateCopingStrategies(emotion: string): Promise<any> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI client not initialized. API key may be missing.");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a supportive coach specializing in emotional regulation for neurodivergent individuals. Provide brief, practical coping strategies."
        },
        {
          role: "user",
          content: `Generate 3 coping strategies for when someone is feeling ${emotion}. The strategies should be neurodivergent-friendly. Format as JSON with 'strategies' array containing objects with 'title', 'description', and 'steps' (array of short steps).`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const strategies = JSON.parse(response.choices[0].message.content || "{}");
    return strategies;
  } catch (error) {
    console.error("Error generating coping strategies:", error);
    return { 
      strategies: [
        {
          title: "Deep Breathing",
          description: "A simple breathing technique to calm the nervous system",
          steps: ["Breathe in for 4 seconds", "Hold for 2 seconds", "Exhale for 6 seconds", "Repeat 5 times"]
        }
      ] 
    };
  }
}
