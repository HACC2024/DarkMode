"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSubscribe } from "~/mqtt/mqtt-client";
import { api } from "~/trpc/react";
import DeviceTest from "../device/_components/DeviceTest";

export default function EnergyStats() {
  const allDevices = api.iot.getAllDevices.useQuery();

  const linkedDevices = allDevices.data?.filter(
    (data) => data.switchInfo !== null,
  );

  const totalWatts =
    linkedDevices?.reduce((acc, curr) => acc + curr.watts, 0) ?? 0;

  const topics = linkedDevices?.map((d) => `device/${d.id}`) ?? [];

  const messages = useSubscribe(topics);

  const usedWatts =
    linkedDevices?.reduce(
      (acc, curr) =>
        acc + (messages[`device/${curr.id}`] === "on" ? curr.watts : 0),
      0,
    ) ?? 0;

  const [wattHours, setWattHours] = useState(0);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const hoursPassed = (now - lastUpdateRef.current) / (1000 * 60 * 60);
      setWattHours((prev) => prev + usedWatts * hoursPassed);
      lastUpdateRef.current = now;
    }, 1000 / 10); // 4 times per second

    return () => clearInterval(interval);
  }, [usedWatts]);

  const costPerHour = (usedWatts / 1000) * 0.4322; // 43.22 cents per kWh
  const yearlyDollars = costPerHour * 24 * 365;
  const maxYearlyDollars = (totalWatts / 1000) * 0.4322 * 24 * 365;
  const savedPerYear = Math.max(0, maxYearlyDollars - yearlyDollars);

  return (
    <div className="p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Current Usage
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-blue-600">
              {usedWatts.toFixed(2)}
            </span>
            <span className="text-gray-500">watts</span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Energy Consumption
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500">Total Wh:</span>
              <span className="font-medium">{wattHours.toFixed(2)} Wh</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500">Total kWh:</span>
              <span className="font-medium">
                {(wattHours / 1000).toFixed(3)} kWh
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Cost Analysis
          </h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500">Current Rate:</span>
              <span className="font-medium">
                ${costPerHour.toFixed(2)}/hour
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-gray-500">Yearly Projection:</span>
              <span className="font-medium">${yearlyDollars.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            Projected Savings
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-emerald-600">
              ${(savedPerYear / 365).toFixed(2)}
            </span>
            <span className="text-gray-500">/ day</span>
            <div className="group relative">
              <span className="cursor-help text-gray-500">ⓘ</span>
              <p className="absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg bg-gray-800 p-2 text-xs text-white group-hover:block">
                Note: This calculation is based on continuous 24-hour operation.
                Actual consumption varies due to intermittent usage patterns and
                variable power requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Connected Devices
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {linkedDevices?.map((d) => <DeviceTest device_id={d.id} />)}
        </div>
      </div>
    </div>
  );
}
