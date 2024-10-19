"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { useSubscribe } from "~/mqtt/mqtt-client";

/*
This component pretends to be an arduino switch.
*/
export function LinkTest({ link_id }: { link_id: number }) {
  const link = api.iot.getLink.useQuery({ id: link_id });
  const [state, setState] = useState("off");

  const topic = link.data ? `device/${link.data.device_id}` : "";
  const message = useSubscribe(topic || "");
  // const message = link.data;
  return link.isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <span>{JSON.stringify(message)}</span>
      <div>State: {state}</div>
    </div>
  );
}
