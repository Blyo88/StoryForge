import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  cachedClient ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS ?? 60000),
    maxRetries: 1
  });

  return cachedClient;
}

export async function generateStructuredOutput<T>(params: {
  name: string;
  instructions: string;
  input: string;
  schema: Record<string, unknown>;
}) {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.5",
    store: false,
    reasoning: {
      effort: "low"
    },
    input: [
      {
        role: "system",
        content: params.instructions
      },
      {
        role: "user",
        content: params.input
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: params.name,
        schema: params.schema,
        strict: true
      }
    }
  });

  if (!response.output_text) {
    if (response.status === "incomplete") {
      throw new Error("OpenAI no completo la generacion. Intenta nuevamente.");
    }

    throw new Error("OpenAI devolvio una respuesta vacia.");
  }

  try {
    return JSON.parse(response.output_text) as T;
  } catch {
    throw new Error("OpenAI devolvio una estructura que no se pudo interpretar.");
  }
}
