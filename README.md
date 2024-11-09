# Tech Stack

## Web

### Frontend
- **TypeScript**
- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **React**

### Backend
- **tRPC** - Typesafe API calls
- **Drizzle** - Database ORM
- **PostgreSQL** - Database

## CAD

### PlatformIO
- **ESP32** Microcontroller

### OnShape
- **CAD** Design

## Server

### Cloudflare
- **DNS**
- **Proxy Web Traffic**

### Docker
- **Deployment**

### Caddy
- **Reverse Proxy**


```bash
docker build -t hacc2024darkmode:latest -f Dockerfile .
docker run -d -p 3000:3000 --restart unless-stopped --name hacc2024darkmode hacc2024darkmode:latest
```
