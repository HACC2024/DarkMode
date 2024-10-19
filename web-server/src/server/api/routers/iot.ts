import { z } from "zod";

import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { devices, links, switches } from "~/server/db/schema";

export const iotRouter = createTRPCRouter({
  getSwitch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const switchItem = ctx.db
        .select()
        .from(switches)
        .where(eq(switches.id, input.id));
      return switchItem;
    }),

  getAllSwitches: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(switches);
  }),

  registerSwitch: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("mutating");
      await ctx.db.insert(switches).values({
        id: input.id,
      });
    }),

  getDevice: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const device = ctx.db
        .select()
        .from(devices)
        .where(eq(devices.id, input.id));
      return device;
    }),

  getAllDevices: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(devices);
  }),

  registerDevice: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(devices).values({
        id: input.id,
      });
    }),

  createLink: publicProcedure
    .input(
      z.object({
        device_name: z.string(),
        device_id: z.string(),
        switch_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(links).values({
        ...input,
      });
    }),

  getAllLinks: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(links);
  }),

  getLink: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const link = await ctx.db
        .select()
        .from(links)
        .where(eq(links.id, input.id));
      return link[0];
    }),

  getLinkFromSwitchId: publicProcedure
    .input(z.object({ switch_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const link = await ctx.db
        .select()
        .from(links)
        .where(eq(links.switch_id, input.switch_id));
      return link[0];
    }),
});
