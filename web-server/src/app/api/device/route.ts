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

  console.log("device registered: " + clientId);
  await api.iot.upsertDevice({ id: clientId });

  return new Response(JSON.stringify({ message: "Device Registered" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
