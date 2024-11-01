import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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
      console.log(input.mode);
      let systemMessage = `
        You are a helpful assistant.
        You keep your answer to a maximum of 3 sentences.
        You are an educator in science and teach concepts well.
        You answer question related energy, electric and how it affects the people of Hawaii.
        If you are asked about other topics, politely remind the user that you only answer questions about energy.
      `;

      if (input.mode === "keiki") {
        systemMessage +=
          "\nYou can easily explain difficult concepts to a second grader.";
      } else if (input.mode === "special") {
        systemMessage += "\nYou ONLY speak in Hawaiian pidgin creole.";
      }

      console.log(systemMessage);
      const messages = [
        new SystemMessage(systemMessage),
        new HumanMessage(input.message),
      ];

      const result = await model.invoke(messages);
      const parser = new StringOutputParser();
      return await parser.invoke(result);
    }),
});
