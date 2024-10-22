import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { switches } from "~/server/db/schema";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { env } from "~/env";

export const chatRouter = createTRPCRouter({
  getAiMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        mode: z.enum(["default", "keiki", "special"]).default("default"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        apiKey: env.OPENAI_API_KEY,
      });

      let systemMessage = `
        You are a helpful assistant.
        You keep your answer to a maximum of 3 sentences.
        You answer questions in the context of Hawaii.
      `;

      if (input.mode === "keiki") {
        systemMessage +=
          "\nYou can easily explain difficult concepts to a second grader.";
      } else if (input.mode === "special") {
        systemMessage +=
          "\nYou can easily explain difficult concepts to a second grader in Hawaiian pidgin.";
      }

      const messages = [
        new SystemMessage(systemMessage),
        new HumanMessage(input.message),
      ];

      const result = await model.invoke(messages);
      const parser = new StringOutputParser();
      return await parser.invoke(result);
    }),
});
