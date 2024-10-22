"use client";

import React, { Fragment, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function App() {
  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: "/unity-display/build/unity-display.loader.js",
    dataUrl: "/unity-display/build/unity-display.data",
    frameworkUrl: "/unity-display/build/unity-display.framework.js",
    codeUrl: "/unity-display/build/unity-display.wasm",
  });

  const [sliderValue, setSliderValue] = useState(0);

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value);
    setSliderValue(value);
    sendMessage("SceneModifier", "Modify", value);
  }

  return (
    <Fragment>
      {/* <Unity
        className="absolute left-0 top-0 -z-50 h-screen w-screen"
        unityProvider={unityProvider}
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={sliderValue}
        onChange={handleSliderChange}
      /> */}
    </Fragment>
  );
}
