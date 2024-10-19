"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function DeviceForm() {
  const utils = api.useUtils();
  const [id, setId] = useState("");

  const registerDevice = api.iot.registerDevice.useMutation({
    onSuccess: async () => {
      await utils.iot.invalidate();
      setId("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        registerDevice.mutate({ id });
      }}
      className="mb-4 border p-2"
    >
      <input
        type="text"
        placeholder="Enter ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
