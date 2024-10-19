"use client";

import { api } from "~/trpc/react";

/*
This component pretends to be an arduino switch.
*/

export function DeviceTest({ device_id }: { device_id: string }) {
  const device = api.iot.getDevice.useQuery({ id: device_id });

  return !device.isLoading ? (
    <div>{JSON.stringify(device.data)}</div>
  ) : (
    <div>Loading...</div>
  );
}
