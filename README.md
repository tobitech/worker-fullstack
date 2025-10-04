# Worker Fullstack

A full-stack web application deployed to Cloudflare Workers with Hono backend and React frontend.

## Tech Stack

- **Backend**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Frontend**: [React](https://react.dev/) - UI library
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast frontend build tool
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless execution environment

## Project Structure

```
├── src/
│   ├── client/         # React frontend
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   └── server/         # Hono backend
│       └── index.ts
├── public/
├── wrangler.jsonc      # Cloudflare Workers config
├── vite.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

For local development, you need to run two servers:

1. **Frontend dev server** (Vite):
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5173`

2. **Backend worker** (in another terminal):
   ```bash
   npm run build  # Build frontend first
   npm run dev:worker
   ```
   Runs on `http://localhost:8787`

The Vite dev server is configured to proxy `/api` requests to the worker.

### Build

Build the React frontend:

```bash
npm run build
```

### Deploy

Build and deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Available Scripts

- `npm run dev` - Start Vite dev server for frontend
- `npm run dev:worker` - Start Cloudflare Worker locally
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Cloudflare Workers

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Example API endpoint

## License

ISC
