import "server-only";

import mqtt from "mqtt";
import { env } from "~/env";

const options = {
  username: env.MQTT_USERNAME,
  password: env.MQTT_PASSWORD,
  clientId: env.MQTT_CLIENT,
};

const mqtt_client = mqtt.connect(env.NEXT_PUBLIC_MQTT_URL, options);

mqtt_client.on("error", (error) => {
  console.log(error);
});
mqtt_client.on("connect", () => {
  console.log("connected");
});

export default mqtt_client;
