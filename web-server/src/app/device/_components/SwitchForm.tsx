"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function SwitchForm() {
  const utils = api.useUtils();
  const [id, setId] = useState("");

  const registerSwitch = api.iot.registerSwitch.useMutation({
    onSuccess: () => {
      utils.iot.invalidate();
      setId("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        registerSwitch.mutate({ id });
      }}
      className="mx-auto mb-4 flex items-center rounded-lg border bg-white p-4 shadow-md"
    >
      <label
        htmlFor="switch-id"
        className="text-l block whitespace-nowrap pr-2 font-bold text-gray-700"
      ></label>
      <input
        id="switch-id"
        type="text"
        placeholder="Enter Switch ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
        className="mr-2 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
