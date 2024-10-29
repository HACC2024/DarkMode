"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { usePublish } from "~/mqtt/mqtt-client";

export default function SwitchTest({ switch_id }: { switch_id: string }) {
  const switchInfo = api.iot.getSwitch.useQuery({ id: switch_id });

  const [state, setState] = useState<"on" | "off">("off");
  const publish = usePublish();

  const handleButtonClick = () => {
    const newState = state === "on" ? "off" : "on";
    setState(newState);
    if (switchInfo.data?.device_id) {
      publish("device/" + switchInfo.data.device_id, newState);
    }
  };

  if (switchInfo.isLoading) return <div>Loading</div>;

  return (
    <div
      className={`my-2 rounded-lg border-2 ${state === "on" ? "border-blue-500" : "border-gray-300"} flex items-center bg-white p-2 shadow-md`}
    >
      <button
        onClick={handleButtonClick}
        className={`h-10 w-10 rounded font-bold text-white ${
          state === "on" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {state === "on" ? "Off" : "On"}
      </button>
      <div className="flex flex-grow pl-3">
        <h2 className="flex-1 text-lg font-semibold">
          {switchInfo.data?.device?.device_name || "Unnamed Device"}
        </h2>
        <p className="flex-1 px-3 text-gray-600">
          {switchInfo.data?.device?.watts
            ? `${switchInfo.data?.device?.watts} Watts`
            : ""}
        </p>
        <span className="flex-1">
          {switchInfo.data?.device_id
            ? `${switchInfo.data.id} --> ${switchInfo.data.device_id}`
            : `${switchInfo.data?.id} --> none`}
        </span>
      </div>
    </div>
  );
}
