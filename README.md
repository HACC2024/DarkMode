# Demo

![output](https://github.com/user-attachments/assets/16e1322e-5d39-438f-a7a3-7013c9db5223)

# Table of Contents

- [Tech Stack](#tech-stack)
- [Diagram](#diagram)
- [Deployment](#deployment)
- [Web](#web)
- [CAD](#cad)
- [Unity](#unity)
- [Chat Bot](#chat-bot)

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

## Diagram

![diagram](https://github.com/user-attachments/assets/d088818c-fc23-4fc4-ae03-80d1e12965b8)

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

Device Registration
<img width="2032" alt="registration" src="https://github.com/user-attachments/assets/37ca0246-041f-4dcc-94b4-6681a3d5d72e">

Energy Statistics Display
<img width="2032" alt="Screenshot 2024-11-15 at 12 08 50 PM" src="https://github.com/user-attachments/assets/15afb5ad-0bd8-492f-8d0d-a5d012af3cc8">

# CAD

## Design Model in OnShape

![1](https://github.com/user-attachments/assets/ecacbf4d-0778-4d8e-845b-c0321a758936)

## Slice Model in Orca Slicer

![2](https://github.com/user-attachments/assets/4433e5dc-7846-49ea-80b0-831809151a87)

## Print Parts

![3](https://github.com/user-attachments/assets/becf3ecb-d791-4dab-8ee0-55943c465470)

## Build Micro-controller

![4](https://github.com/user-attachments/assets/f2ac8d99-d2e1-4d9a-a5eb-cf982e2f1ba4)

## Sand / Putty / Sand / Prime / Paint

![5](https://github.com/user-attachments/assets/c625def0-10de-42f0-95b2-77eaf7e3c318)

## Final

![hacc-presentation](https://github.com/user-attachments/assets/192f3452-58df-44b1-83a3-eddbd396f74c)

# Unity

Goal is to save the island by reducing energy usage
<img width="2032" alt="Screenshot 2024-11-09 at 9 54 01 PM" src="https://github.com/user-attachments/assets/2c539989-2bde-47fe-a547-bf94d3bc5031">
<img width="2032" alt="display-high" src="https://github.com/user-attachments/assets/8ddaecd6-7a06-4bb6-acba-6caca5ac58ea">
<img width="2032" alt="display-low" src="https://github.com/user-attachments/assets/01fb720b-d830-4048-a736-0441fa82af62">

# Chat Bot

Ask the Chat Bot questions relating to energy
<img width="2032" alt="Screenshot 2024-11-09 at 9 42 30 PM" src="https://github.com/user-attachments/assets/af8e08cf-0dbd-4faa-af7c-ac72462d60a7">
Keiki mode for children
<img width="2032" alt="Screenshot 2024-11-09 at 9 42 40 PM" src="https://github.com/user-attachments/assets/186cfd82-0ccb-4db8-88f2-6f4dd53677a5">
Hidden feature - Tell the Chat Bot to tell you a joke and see what happens!
<img width="2032" alt="Screenshot 2024-11-09 at 9 42 51 PM" src="https://github.com/user-attachments/assets/02ca77b0-5332-4c06-a11f-8314db23d3a2">
After asking to tell you a joke, the Chat Bot will now speak in Hawaiian Pidgin
<img width="2032" alt="Screenshot 2024-11-09 at 9 43 08 PM" src="https://github.com/user-attachments/assets/29d52f07-8e48-413c-a91b-40729270fda5">
