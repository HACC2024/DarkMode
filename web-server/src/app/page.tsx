"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useSubscribe } from "~/mqtt/mqtt-client";
import { api } from "~/trpc/react";
import EnergyStats from "./_components/EnergyStats";

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

  const { unityProvider, sendMessage, loadingProgression, isLoaded } =
    useUnityContext({
      loaderUrl: "/unity-display/Build/unity-display.loader.js",
      dataUrl: "/unity-display/Build/unity-display.data",
      frameworkUrl: "/unity-display/Build/unity-display.framework.js",
      codeUrl: "/unity-display/Build/unity-display.wasm",
    });

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      sendMessage("SceneModifier", "Modify", value);
      sendMessage("SceneModifier", "SetTotalWatts", totalWatts);
    }
  }, [value, isLoaded, sendMessage]);

  return (
    <>
      {loadingProgression < 1 && (
        <>
          <div>Loading Museum Dashboard</div>
          <div className="relative h-2 w-full rounded bg-gray-200">
            <div
              className="absolute h-full rounded bg-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgression * 100}%` }}
            />
          </div>
        </>
      )}
      <Unity
        className="absolute left-0 top-0 -z-50 h-screen w-screen"
        unityProvider={unityProvider}
      />
      <button
        onClick={() => setShowStats(!showStats)}
        className="absolute bottom-4 right-4 z-40 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {showStats ? "Hide Stats" : "Show Stats"}
      </button>

      <div hidden={!showStats}>
        <div className="absolute inset-0 z-20 bg-black/30" />
        <div className="absolute bottom-16 right-4 z-30 rounded-lg bg-white p-4 shadow-lg">
          <EnergyStats />
        </div>
      </div>
    </>
  );
}
