"use client";

import React, { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";

type Message = { type: "user" | "ai"; text: string; loading?: boolean }[];

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message>([]);
  const [keikiMode, setKeikiMode] = useState(false);
  const [specialMode, setSpecialMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const sendMessage = api.chat.getAiMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { text: data, type: "ai" } : msg,
        ),
      );
    },
  });

  const handleSend = () => {
    if (userInput.trim()) {
      if (userInput.toLowerCase().trim() === "tell me a joke") {
        setMessages((prev) => [
          ...prev,
          { text: userInput, type: "user" },
          {
            text: "What do you call a blind deer in Hawaii?\n\nNo eye deah'.",
            type: "ai",
          },
        ]);
        setSpecialMode(true);
        setUserInput("");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { text: userInput, type: "user" },
        { text: "...", type: "ai", loading: true },
      ]);
      setUserInput("");
      sendMessage.mutate({
        message: userInput,
        mode: specialMode ? "special" : keikiMode ? "keiki" : "default",
      });
    }
  };

  return (
    <div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                {msg.loading ? (
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex space-x-4"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Send
            </button>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={keikiMode}
                onChange={() => setKeikiMode((prev) => !prev)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Keiki Mode
              </span>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
