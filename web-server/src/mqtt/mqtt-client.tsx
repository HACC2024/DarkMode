"use client";
import { env } from "~/env";
import React, { createContext, useState, useEffect } from "react";
import mqtt, { MqttClient } from "mqtt"; // or any other MQTT client library you prefer

type MQTTContextType = {
  client: MqttClient | null;
  isConnected: boolean;
  messages: Record<string, string>;
  subscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
};

const MQTTContext = createContext<MQTTContextType>({
  client: null,
  isConnected: false,
  messages: {},
  subscribe: (input: string) => {},
  publish: (input: string) => {},
});

let client: MqttClient | null = null;

export const MQTTProvider = (props: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] =
    useState<MQTTContextType["isConnected"]>(false);
  const [messages, setMessages] = useState<MQTTContextType["messages"]>({});

  useEffect(() => {
    if (!client?.connected) {
      const randomClientId = `client_${Math.random().toString(36)}`;
      console.log("connecting to mqtt server with id: " + randomClientId);

      client = mqtt.connect(env.NEXT_PUBLIC_MQTT_URL, {
        clientId: randomClientId,
        rejectUnauthorized: false,
      });
    }

    client.on("connect", () => {
      console.log("connected to mqtt server");
      setIsConnected(true);
    });

    client.on("reconnect", () => {
      console.log("reconnecting");
    });

    client.on("disconnect", () => {
      console.log("disconnected from mqtt server");
      setIsConnected(false);
    });

    client.on("error", (error) => {
      console.log(error);
    });

    client.on("message", (topic, message) => {
      console.log(topic + ": " + message);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [topic]: message.toString(),
      }));
    });

    return () => {
      console.log("LKSDJFLKSJD");
      client?.end();
    };
  }, []);

  const subscribe = (topic: string) => {
    if (client && isConnected) {
      console.log("subscribe: " + topic);
      client.subscribe(topic);
    }
  };

  const publish = (topic: string, message: string) => {
    if (client && isConnected) {
      console.log(`publish: ${topic} ${message}`);
      client.publish(topic, message, { retain: true });
    }
  };

  return (
    <MQTTContext.Provider
      value={{ client, isConnected, messages, subscribe, publish }}
    >
      {props.children}
    </MQTTContext.Provider>
  );
};

const useMQTT = () => React.useContext(MQTTContext);

export function useSubscribe(topics: string[]) {
  const { client, isConnected, messages } = useMQTT();

  useEffect(() => {
    if (isConnected) {
      topics.forEach((topic) => {
        if (topic !== "") {
          client?.subscribe(topic);
        }
      });
    }
  }, [isConnected, topics]);

  return Object.fromEntries(
    Object.entries(messages).filter(([key]) => topics.includes(key)),
  );
}

export function usePublish() {
  const { publish } = useMQTT();

  return publish;
}
