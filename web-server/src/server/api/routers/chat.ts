import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { env } from "~/env";

let systemMessage = `
  You are a helpful assistant.
  You keep your answer to a maximum of 3 sentences.
  You are an educator in sustainability in Hawaii and teach concepts well.
  Answer the question in the context of Hawaii.
`;

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

      if (input.mode === "keiki") {
        systemMessage +=
          "\nYou are speaking to a second grader and can easily explain difficult concepts to them.";
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
