# Table of Contents

- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Web](#web)
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
|              | Ender 3 V3 SE  | 3D Printer            |
|              | Orca           | 3D Printer Slicer     |
| **Server**   | Cloudflare     | DNS / Proxy           |
|              | Docker         | Deployment            |
|              | Caddy          | Reverse Proxy         |
|              | Let's Encrypt  | Certificate Authority |

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

# Web

<img width="2032" alt="registration" src="https://github.com/user-attachments/assets/37ca0246-041f-4dcc-94b4-6681a3d5d72e">

# CAD

<img width="2032" alt="device-onshape" src="https://github.com/user-attachments/assets/f57718d3-9e98-4e7c-9ef8-d3829a7dcf3e">
<img width="2032" alt="switch-onshape" src="https://github.com/user-attachments/assets/f28e041b-4b0c-4aa5-905f-cfdeb26c38ac">

# Unity

<img width="2032" alt="display-high" src="https://github.com/user-attachments/assets/8ddaecd6-7a06-4bb6-acba-6caca5ac58ea">
<img width="2032" alt="display-low" src="https://github.com/user-attachments/assets/01fb720b-d830-4048-a736-0441fa82af62">
