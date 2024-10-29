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

  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "/unity-display/build/unity-display.loader.js",
    dataUrl: "/unity-display/build/unity-display.data",
    frameworkUrl: "/unity-display/build/unity-display.framework.js",
    codeUrl: "/unity-display/build/unity-display.wasm",
  });

  useEffect(() => {
    sendMessage("SceneModifier", "Modify", value);
  }, [value]);

  // const [sliderValue, setSliderValue] = useState(0);

  // function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const value = parseFloat(event.target.value);
  //   setSliderValue(value);
  //   sendMessage("SceneModifier", "Modify", value);
  // }

  return (
    <Fragment>
      <Unity
        className="absolute left-0 top-0 -z-50 h-screen w-screen"
        unityProvider={unityProvider}
      />
      {/* <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={sliderValue}
        onChange={handleSliderChange}
      /> */}
      <div>{JSON.stringify(linkedDevices)}</div>
      <div>
        {usedWatts} / {totalWatts}
      </div>
    </Fragment>
  );
}
