import { z } from "zod";

import { eq, isNotNull, isNull, notInArray } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { devices, switches } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const iotRouter = createTRPCRouter({
  registerSwitch: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(switches).values({
        id: input.id,
      });
    }),

  getSwitch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const switchInfo = ctx.db.query.switches.findFirst({
        where: eq(switches.id, input.id),
        with: { device: true },
      });

      if (!switchInfo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Switch not found" });
      }

      return switchInfo;
    }),

  getAllSwitches: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.switches.findMany({
      with: { device: true },
    });
  }),

  getUnlinkedDevices: publicProcedure.query(({ ctx }) => {
    const linkedDeviceIds = ctx.db
      .select({ id: switches.device_id })
      .from(switches)
      .where(isNotNull(switches.device_id));

    const unlinkedDeviceIds = ctx.db.query.devices.findMany({
      where: notInArray(devices.id, linkedDeviceIds),
    });

    return unlinkedDeviceIds;
  }),

  getUnlinkedSwitches: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: switches.id })
      .from(switches)
      .where(isNull(switches.device_id));
  }),

  // linkSwitchToDevice: publicProcedure
  //   .input(z.object({ id: z.string(), device_id: z.string() }))
  //   .mutation(({ ctx, input }) => {
  //     ctx.db
  //       .update(switches)
  //       .set({ device_id: input.device_id })
  //       .where(eq(switches.id, input.id));
  //   }),

  upsertDevice: publicProcedure
    .input(
      z.object({
        id: z.string(),
        device_name: z.string().optional(),
        watts: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(devices)
        .values({
          ...input,
        })
        .onConflictDoUpdate({
          target: devices.id,
          set: input,
        });
    }),

  createLink: publicProcedure
    .input(
      z.object({
        device_id: z.string(),
        switch_id: z.string(),
        device_name: z.string(),
        watts: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(devices)
        .set({
          device_name: input.device_name,
          watts: input.watts,
        })
        .where(eq(devices.id, input.device_id));

      await ctx.db
        .update(switches)
        .set({
          device_id: input.device_id,
        })
        .where(eq(switches.id, input.switch_id));
    }),

  getDevice: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const device = ctx.db.query.devices.findFirst({
        where: eq(devices.id, input.id),
        with: { switchInfo: true },
      });

      if (!device) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Device not found" });
      }

      return device;
    }),

  getAllDevices: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.devices.findMany({
      with: { switchInfo: true },
    });
  }),

  getAllLinkedDevices: publicProcedure.query(async ({ ctx }) => {
    const devices = await ctx.db.query.devices.findMany({
      with: { switchInfo: true },
    });

    const linkedDevices = devices.filter((data) => data.switchInfo !== null);
    return linkedDevices;
  }),
});
