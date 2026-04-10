"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "../_generated/server";

const SYSTEM_PROMPT = `You are Nexium AI, a helpful and friendly AI assistant built into the Nexium platform. You help users with:
- Building websites and web apps
- Design advice and best practices
- Technical questions about web development
- Project planning and ideation
- Content writing and copywriting

Keep your responses concise, clear, and actionable. Use markdown formatting when helpful. Be encouraging and supportive.`;

export const generateResponse = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (_ctx, args) => {
    const openai = new OpenAI({
      baseURL: "http://ai-gateway.hercules.app/v1",
      apiKey: process.env.HERCULES_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "system" as const, content: SYSTEM_PROMPT },
          ...args.messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
      });

      return {
        text: response.choices[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.",
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`AI Error: ${error.message}`);
      }
      throw new Error("Failed to generate a response. Please try again.");
    }
  },
});
