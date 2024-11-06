"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useSubscribe } from "~/mqtt/mqtt-client";
import { api } from "~/trpc/react";

export default function App() {
  const allDevices = api.iot.getAllDevices.useQuery();
  const linkedDevices = allDevices.data?.filter(
    (data) => data.switchInfo !== null,
  );
  const totalWatts =
    linkedDevices?.reduce((acc, curr) => acc + curr.watts, 0) ?? 0;

  const topics =
    linkedDevices?.map((linkedDevice) => `device/${linkedDevice.id}`) ?? [];
  const messages = useSubscribe(topics);
  const usedWatts =
    linkedDevices?.reduce(
      (acc, curr) =>
        acc + (messages[`device/${curr.id}`] === "on" ? curr.watts : 0),
      0,
    ) ?? 0;

  const value = usedWatts / totalWatts;

  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/unity-display/Build/unity-display.loader.js",
    dataUrl: "/unity-display/Build/unity-display.data",
    frameworkUrl: "/unity-display/Build/unity-display.framework.js",
    codeUrl: "/unity-display/Build/unity-display.wasm",
  });

  useEffect(() => {
    if (isLoaded) {
      sendMessage("SceneModifier", "Modify", value);
      sendMessage("SceneModifier", "SetTotalWatts", totalWatts);
    }
  }, [value, isLoaded, sendMessage]);

  return (
    <>
      <Unity
        className="absolute left-0 top-0 -z-50 h-screen w-screen"
        unityProvider={unityProvider}
      />
    </>
  );
}
