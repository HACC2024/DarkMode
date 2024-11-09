# Table of Contents

- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [CAD](#cad)
- [Unity](#unity)

# Tech Stack

| **Category** | **Technology** | **Details**           |
| ------------ | -------------- | --------------------- |
| **Unity**    | C#             | Language              |
|              | ShaderLab      | Language              |
| **Web**      | TypeScript     | Language              |
| **Frontend** | NextJS         | React Framework       |
|              | Tailwind CSS   | Styling               |
|              | React          | Web Framework         |
| **Backend**  | tRPC           | Typesafe API calls    |
|              | Drizzle        | Database ORM          |
|              | PostgreSQL     | Database              |
| **ChatBot**  | LangChain      | LLM Framework         |
|              | OpenAI         | ChatGPT API           |
| **CAD**      | PlatformIO     | ESP32 Microcontroller |
|              | OnShape        | CAD Software          |
| **Server**   | Cloudflare     | DNS/ Proxy            |
|              | Docker         | Deployment            |
|              | Caddy          | Reverse Proxy         |

# Deployment

## web-server/.env

```bash
# Database
DATABASE_URL="<URL>"
DEVICE_TOKEN="<Token>"

# MQTT
NEXT_PUBLIC_MQTT_URL="wss://<domain>:<port>/<path>"

# OpenAI
OPENAI_API_KEY="<key>"
```

## hkm-micro-controller/include/SECRETS.h

```cpp
#define SSID "<Network SSID>"
#define PASS "<Network Password>"

#define TOKEN "<Secret Token>"
#define SERVER_URL "<Web URL>"
#define SERVER_PORT <Port>

#define MQTT_DOMAIN "<Domain>"
#define MQTT_PORT <Port>
```

```bash
cd web-server
docker build -t hacc2024darkmode:latest -f Dockerfile .
docker run -d -p 3000:3000 --restart unless-stopped --name hacc2024darkmode hacc2024darkmode:latest
```

# CAD

# Unity
