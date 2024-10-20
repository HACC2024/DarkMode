"use client";

import DeviceForm from "../_components/DeviceForm";
import DeviceTest from "../_components/DeviceTest";
import LinkForm from "../_components/LinkForm";
import SwitchForm from "../_components/SwitchForm";
import SwitchTest from "../_components/SwitchTest";
import { api } from "~/trpc/react";

export default function TestPage() {
  const allSwitches = api.iot.getAllSwitches.useQuery();
  const allDevices = api.iot.getAllDevices.useQuery();

  return (
    <main>
      <h1 className="pb-3 text-center text-2xl font-bold">Register Switch</h1>
      <SwitchForm />
      {allSwitches.data?.map((switchItem) => (
        <SwitchTest key={switchItem.id} switch_id={switchItem.id} />
      ))}
      <h1 className="py-3 text-center text-2xl font-bold">Register Device</h1>
      <DeviceForm />
      {allDevices.data?.map((device) => (
        <DeviceTest key={device.id} device_id={device.id} />
      ))}
      <h1 className="py-3 text-center text-2xl font-bold">Register Link</h1>
      <LinkForm />
    </main>
  );
}
