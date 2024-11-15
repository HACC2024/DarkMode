"use client";

import { useSubscribe } from "~/mqtt/mqtt-client";
import { api } from "~/trpc/react";

/*
This component pretends to be an arduino device.
*/
export default function DeviceTest({
  device_id,
  debug = false,
}: {
  device_id: string;
  debug?: boolean;
}) {
  const device = api.iot.getDevice.useQuery({ id: device_id });
  const topic = device.data ? `device/${device.data?.id}` : "";
  const message = useSubscribe([topic]);
  const isOn = message[topic] === "on";

  if (device.isLoading) return <div>Loading</div>;

  return (
    <div
      className={`my-2 rounded-lg border-2 ${isOn ? "border-blue-500" : "border-gray-300"} flex items-center bg-white px-2 py-1 shadow-md`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded font-bold text-white ${
          isOn ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <div className="pl-3">
        <h2 className="text-lg font-semibold">
          {device.data?.device_name || "Unnamed Device"}
        </h2>
        <p className="text-gray-600">
          {device.data?.watts} Watts {debug ? "| ID: " + device.data?.id : ""}
        </p>
      </div>
    </div>
  );
}
