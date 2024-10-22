"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";

type Message = { type: "user" | "ai"; text: string }[];

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message>([]);
  const [keikiMode, setKeikiMode] = useState(false); // State for keiki mode

  const sendMessage = api.chat.getAiMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { text: userInput, type: "user" },
        { text: data, type: "ai" },
      ]);
      setUserInput("");
    },
  });

  const handleSend = () => {
    if (userInput.trim()) {
      sendMessage.mutate({
        message: userInput,
        mode: keikiMode ? "keiki" : "default",
      }); // Use keiki mode state
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col p-4">
      <div className="mb-4 flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${msg.type === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block rounded-lg p-2 ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 rounded-lg border p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 rounded-lg bg-blue-500 p-2 text-white"
        >
          Send
        </button>
        <label className="ml-2 flex items-center">
          <input
            type="checkbox"
            checked={keikiMode}
            onChange={() => setKeikiMode((prev) => !prev)}
            className="mr-1"
          />
          Keiki Mode
        </label>
      </div>
    </div>
  );
}
