"use client";

import { ChangeEvent, useState } from "react";
import { api } from "~/trpc/react";

export default function LinkForm() {
  const utils = api.useUtils();
  const [formData, setFormData] = useState({
    device_name: "",
    device_id: "",
    switch_id: "",
    watts: 0,
  });

  const createLink = api.iot.createLink.useMutation({
    onSuccess: async () => {
      await utils.iot.invalidate();
      setFormData({
        device_name: "",
        device_id: "",
        switch_id: "",
        watts: 0,
      });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createLink.mutate(formData);
      }}
      className="mb-4 border p-2"
    >
      <input
        type="text"
        name="device_name"
        placeholder="Enter Device Name"
        value={formData.device_name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="watts"
        placeholder="Enter Watts"
        value={formData.watts}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="device_id"
        placeholder="Enter Device ID"
        value={formData.device_id}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="switch_id"
        placeholder="Enter Switch ID"
        value={formData.switch_id}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
