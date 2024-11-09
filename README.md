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
|              | OpenAI         | AI API                |
| **CAD**      | PlatformIO     | ESP32 Microcontroller |
|              | OnShape        | CAD Software          |
| **Server**   | Cloudflare     | DNS/ Proxy            |
|              | Docker         | Deployment            |
|              | Caddy          | Reverse Proxy         |

```bash
docker build -t hacc2024darkmode:latest -f Dockerfile .
docker run -d -p 3000:3000 --restart unless-stopped --name hacc2024darkmode hacc2024darkmode:latest
```
