"use client";

import { useSubscribe } from "~/mqtt/mqtt-client";
import { api } from "~/trpc/react";

/*
This component pretends to be an arduino switch.
*/
export default function DeviceTest({ device_id }: { device_id: string }) {
  const device = api.iot.getDevice.useQuery({ id: device_id });
  // const [state, setState] = useState("off");
  const topic = device.data ? `device/${device.data?.id}` : "";
  const message = useSubscribe(topic);

  if (device.isLoading) return <div>Loading</div>;
  return <div>{JSON.stringify(device.data) + " " + message}</div>;
}
