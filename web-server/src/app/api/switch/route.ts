import { api } from "~/trpc/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.DEVICE_TOKEN}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const clientId = req.headers.get("X-Client-ID");

  if (!clientId) {
    return new Response(
      JSON.stringify({ error: "X-Client-ID header is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  console.log("Switch registered: " + clientId);
  await api.iot.registerSwitch({ id: clientId });

  return new Response(JSON.stringify({ message: "Switch Registered" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${process.env.DEVICE_TOKEN}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const clientId = req.headers.get("X-Client-ID");

  if (!clientId) {
    return new Response(
      JSON.stringify({ error: "X-Client-ID header is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const device_id = await api.iot.getDeviceIdFromSwitchId({ id: clientId });

  if (!device_id) {
    return new Response("Device ID not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response(device_id, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
