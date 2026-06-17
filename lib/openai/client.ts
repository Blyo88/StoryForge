import { GoogleGenAI } from "@google/genai";

type GeminiConfig = {
  apiKey: string;
  model: string;
  timeoutMs: number;
};

let cachedClient: GoogleGenAI | null = null;

function getGeminiConfig(): GeminiConfig | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS ?? 60000)
  };
}

export function isGeminiConfigured() {
  return getGeminiConfig() !== null;
}

function getGeminiClient() {
  const config = getGeminiConfig();

  if (!config) {
    return null;
  }

  cachedClient ??= new GoogleGenAI({
    apiKey: config.apiKey
  });

  return cachedClient;
}

export async function generateStructuredOutput<T>(params: {
  name: string;
  instructions: string;
  input: string;
  schema: Record<string, unknown>;
}) {
  const config = getGeminiConfig();
  const client = getGeminiClient();

  if (!config || !client) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await client.models.generateContent({
    model: config.model,
    contents: params.input,
    config: {
      httpOptions: {
        timeout: config.timeoutMs
      },
      // Keep task context in system instruction and require strict JSON output.
      systemInstruction: `${params.instructions}\n\nSchema name: ${params.name}`,
      temperature: 0.4,
      responseMimeType: "application/json",
      responseJsonSchema: params.schema
    }
  });

  const outputText = response.text?.trim();

  if (!outputText) {
    const finishReason = response.candidates?.[0]?.finishReason;

    if (finishReason && finishReason !== "STOP") {
      throw new Error("Gemini no completo la generacion. Intenta nuevamente.");
    }

    throw new Error("Gemini devolvio una respuesta vacia.");
  }

  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new Error("Gemini devolvio una estructura que no se pudo interpretar.");
  }
}
