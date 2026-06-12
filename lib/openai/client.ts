import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  cachedClient ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
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
    throw new Error("OpenAI returned an empty structured response.");
  }

  return JSON.parse(response.output_text) as T;
}

