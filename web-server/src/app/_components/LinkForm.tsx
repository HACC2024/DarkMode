"use client";

import { api } from "~/trpc/react";
import { FormEvent, useRef } from "react";

export default function LinkForm() {
  const unlinkedDevices = api.iot.getUnlinkedDevices.useQuery();
  const unlinkedSwitches = api.iot.getUnlinkedSwitches.useQuery();

  const utils = api.useUtils();
  const updateDevice = api.iot.createLink.useMutation({
    onSettled() {
      utils.iot.invalidate();
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const data = {
      device_id: formData.get("device_id") as string,
      switch_id: formData.get("switch_id") as string,
      device_name: formData.get("device_name") as string,
      watts: Number(formData.get("watts")),
    };
    console.log(JSON.stringify(data));
    updateDevice.mutate(data);
    // formRef.current?.reset();
  };

  if (unlinkedDevices.isLoading || unlinkedSwitches.isLoading)
    return <div>Loading...</div>;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="device_id" className="block text-sm font-medium">
          Device ID
        </label>
        <select
          id="device_id"
          name="device_id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Select a device</option>
          {unlinkedDevices.data?.map((device) => (
            <option key={device.id} value={device.id}>
              {device.device_name || device.id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="switch_id" className="block text-sm font-medium">
          Switch ID
        </label>
        <select
          id="switch_id"
          name="switch_id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Select a switch</option>
          {unlinkedSwitches.data?.map((switchItem) => (
            <option key={switchItem.id} value={switchItem.id}>
              {switchItem.id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="device_name" className="block text-sm font-medium">
          Device Name
        </label>
        <input
          type="text"
          id="device_name"
          name="device_name"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="watts" className="block text-sm font-medium">
          Watts
        </label>
        <input
          type="number"
          id="watts"
          name="watts"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          required
        />
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
