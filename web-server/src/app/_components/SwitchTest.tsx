"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { usePublish } from "~/mqtt/mqtt-client";
/*
This component pretends to be an arduino switch.
*/
export function SwitchTest({ switch_id }: { switch_id: string }) {
  const device = api.iot.getSwitch.useQuery({ id: switch_id });
  const link = api.iot.getLinkFromSwitchId.useQuery({ switch_id: switch_id });
  const [state, setState] = useState<"on" | "off">("off");
  const publish = usePublish();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => (prev === "on" ? "off" : "on"));
  };

  useEffect(() => {
    if (link.data) {
      publish("device/" + link.data.device_id, `{"state":"${state}"}`);
    }
  }, [state]);

  return !device.isLoading && link.data ? (
    <div>
      <span>{JSON.stringify(device.data)}</span>
      <label>
        <input
          type="checkbox"
          checked={state === "on"}
          onChange={handleCheckboxChange}
        />
      </label>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
