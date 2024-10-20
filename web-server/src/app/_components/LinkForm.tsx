"use client";

import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  device_id: z.string().min(1, "Device ID is required"),
  switch_id: z.string().min(1, "Switch ID is required"),
  device_name: z.string().min(1, "Device Name is required"),
  watts: z.number().min(0, "Watts must be a positive number"),
});

export default function LinkForm() {
  const unlinkedDevices = api.iot.getUnlinkedDevices.useQuery();
  const unlinkedSwitches = api.iot.getUnlinkedSwitches.useQuery();

  const utils = api.useUtils();
  const updateDevice = api.iot.createLink.useMutation({
    onSettled() {
      utils.iot.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(JSON.stringify(data));
    updateDevice.mutate(data);
  };

  if (unlinkedDevices.isLoading || unlinkedSwitches.isLoading)
    return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit((d) => {
        updateDevice.mutate(d);
      })}
      className="mx-auto mb-4 rounded-lg border bg-white p-4 shadow-md"
    >
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="device_id" className="block text-sm font-medium">
            Device ID
          </label>
          <select
            id="device_id"
            {...register("device_id")}
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 ${errors.device_id ? "border-red-500" : ""}`}
          >
            <option value="">Select a device</option>
            {unlinkedDevices.data?.map((device) => (
              <option key={device.id} value={device.id}>
                {device.device_name || device.id}
              </option>
            ))}
          </select>
          {errors.device_id && (
            <p className="text-sm text-red-500">{errors.device_id.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="switch_id" className="block text-sm font-medium">
            Switch ID
          </label>
          <select
            id="switch_id"
            {...register("switch_id")}
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 ${errors.switch_id ? "border-red-500" : ""}`}
          >
            <option value="">Select a switch</option>
            {unlinkedSwitches.data?.map((switchItem) => (
              <option key={switchItem.id} value={switchItem.id}>
                {switchItem.id}
              </option>
            ))}
          </select>
          {errors.switch_id && (
            <p className="text-sm text-red-500">{errors.switch_id.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="device_name" className="block text-sm font-medium">
            Device Name
          </label>
          <input
            type="text"
            id="device_name"
            {...register("device_name")}
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 ${errors.device_name ? "border-red-500" : ""}`}
          />
          {errors.device_name && (
            <p className="text-sm text-red-500">{errors.device_name.message}</p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="watts" className="block text-sm font-medium">
            Watts
          </label>
          <input
            type="number"
            id="watts"
            {...register("watts", { valueAsNumber: true })}
            className={`mt-1 block w-full rounded-md border border-gray-300 p-2 ${errors.watts ? "border-red-500" : ""}`}
          />
          {errors.watts && (
            <p className="text-sm text-red-500">{errors.watts.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white"
      >
        Submit
      </button>
    </form>
  );
}
