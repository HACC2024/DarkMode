"use client";

import DeviceForm from "../_components/DeviceForm";
import { DeviceTest } from "../_components/DeviceTest";
import LinkForm from "../_components/LinkForm";
import { LinkTest } from "../_components/LinkTest";
import SwitchForm from "../_components/SwitchForm";
import { SwitchTest } from "../_components/SwitchTest";
import { api } from "~/trpc/react";

export default function TestPage() {
  const allSwitches = api.iot.getAllSwitches.useQuery();
  const allDevices = api.iot.getAllDevices.useQuery();
  const allLinks = api.iot.getAllLinks.useQuery();

  return (
    <main>
      <h1 className="pb-3 font-bold">Register Switch</h1>
      <SwitchForm />
      {allSwitches.data?.map((switchItem) => (
        <SwitchTest key={switchItem.id} switch_id={switchItem.id} />
      ))}
      <h1 className="py-3 font-bold">Register Device</h1>
      <DeviceForm />
      {allDevices.data?.map((device) => (
        <DeviceTest key={device.id} device_id={device.id} />
      ))}
      <h1 className="py-3 font-bold">Devices</h1>
      <LinkForm />
      {allLinks.data?.map((link) => (
        <LinkTest key={link.id} link_id={link.id} />
      ))}
    </main>
  );
}
