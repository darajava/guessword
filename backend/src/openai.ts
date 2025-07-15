import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { promises as fs } from "fs";
import path from "path";

export class OpenAIClient {
  private static instance: OpenAIClient;
  public client: OpenAI;

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      project: process.env.OPENAI_PROJECT,
    });
  }

  public static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }

    return OpenAIClient.instance;
  }

  public static async complete(params: {
    prompt: string;
    system?: string;
    maxCompletionTokens?: number;

    model?: string;
  }): Promise<any> {
    const messages: Array<ChatCompletionMessageParam> = [
      {
        role: "user",
        content: params.prompt,
      },
    ];

    if (params.system) {
      messages.unshift({
        role: "system",
        content: params.system,
      });
    }

    const defaultModel = "gpt-4.1";

    const response =
      await OpenAIClient.getInstance().client.chat.completions.create({
        messages,
        max_completion_tokens: params.maxCompletionTokens || 1000,
        response_format: { type: "json_object" },
        n: 1,
        model: params.model || defaultModel,
      });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsedResponse = JSON.parse(content);
      return parsedResponse;
    } catch (error) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error(
        "Invalid JSON response from OpenAI" + JSON.stringify(content, null, 2)
      );
    }
  }

  public static async getVoice(params: { input: string }): Promise<string> {
    const mp3 = await OpenAIClient.getInstance().client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "sage",
      instructions:
        "Make the voice sound like a therapist. Very warm and validating, yet cheerful.",
      input:
        // process.env.NODE_ENV === "development"
        // ? params.input.slice(0, 50) :
        params.input,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    const filename = "ai-" + makeid(20) + ".mp3";

    const filepath = path.join(
      process.env.UPLOAD_DIR!,
      "/therapist-audio",
      filename
    );

    await ensureDirectoryExists(path.dirname(filepath));

    await fs.writeFile(filepath, buffer);

    return filename;
  }
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath); // Check if the directory exists
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Directory does not exist, create it
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      // Some other error occurred, rethrow it
      throw error;
    }
  }
}

const makeid = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
