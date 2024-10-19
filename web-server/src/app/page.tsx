"use client";

import React from "react";
import { useSubscribe, usePublish } from "~/mqtt/mqtt-client";

export default function Home() {
  const message = useSubscribe("hello");
  const publish = usePublish();

  return (
    <>
      <div>{JSON.stringify(message)}</div>
      <button
        onClick={() => {
          publish("hello", "from button");
        }}
      >
        click
      </button>
    </>
  );
}
