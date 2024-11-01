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

  const switchLinkText = switchInfo.data?.device_id
    ? `${switchInfo.data.id} --> ${switchInfo.data.device_id}`
    : `${switchInfo.data?.id} --> none`;

  const wattsText = switchInfo.data?.device?.watts
    ? `${switchInfo.data?.device?.watts} Watts`
    : "";

  if (switchInfo.isLoading) return <div>Loading</div>;

  return (
    <div
      className={`my-2 rounded-lg border-2 px-2 ${state === "on" ? "border-blue-500" : "border-gray-300"} flex items-center bg-white p-1 shadow-md`}
    >
      <button
        onClick={handleButtonClick}
        className={`h-10 w-10 rounded font-bold text-white ${
          state === "on" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {state !== "on" ? "Off" : "On"}
      </button>
      <div className="px-2">
        <h2 className="text-lg font-semibold">
          {switchInfo.data?.device?.device_name || "Unnamed Device"}
        </h2>
        <p className="text-gray-600">
          {wattsText} | {switchLinkText}
        </p>
      </div>
    </div>
  );
}
