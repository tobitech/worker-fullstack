# Complete Guide: Building a Full-Stack Cloudflare Workers Application

This tutorial will guide you through creating a full-stack application with React frontend and Hono backend, deployable to Cloudflare Workers.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- A Cloudflare account (free tier works fine)
- Basic knowledge of React and TypeScript

## What We'll Build

A full-stack application with:
- **Frontend**: React with TypeScript and Vite
- **Backend**: Hono framework running on Cloudflare Workers
- **Deployment**: Cloudflare Workers with static asset serving

---

## Step 1: Create Project Directory

```bash
mkdir worker-fullstack
cd worker-fullstack
```

## Step 2: Initialize npm Project

```bash
npm init -y
```

This creates a `package.json` file.

## Step 3: Install Dependencies

### Install Core Dependencies

```bash
npm install hono wrangler
```

- `hono`: Lightweight web framework for Cloudflare Workers
- `wrangler`: Cloudflare's CLI tool for Workers

### Install Frontend Dependencies

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react vite typescript
```

## Step 4: Configure Package Scripts

Open [package.json](package.json) and update the `scripts` section:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:worker": "wrangler dev",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && wrangler deploy"
  },
  "type": "commonjs"
}
```

## Step 5: Create Project Structure

Create the following directory structure:

```bash
mkdir -p src/client src/server
```

Your structure should look like:
```
worker-fullstack/
├── src/
│   ├── client/    # React frontend
│   └── server/    # Hono backend
├── package.json
```

## Step 6: Configure Wrangler

Create [wrangler.jsonc](wrangler.jsonc) in the root directory:

```jsonc
{
  "name": "worker-fullstack",
  "main": "./src/server/index.ts",
  "compatibility_date": "2025-10-03",
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS"
  }
}
```

**Explanation:**
- `main`: Entry point for your Worker
- `compatibility_date`: Cloudflare Workers compatibility version
- `assets`: Configuration for serving static files (your built React app)

## Step 7: Configure TypeScript

Create [tsconfig.json](tsconfig.json):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create [tsconfig.node.json](tsconfig.node.json):

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## Step 8: Configure Vite

Create [vite.config.ts](vite.config.ts):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
```

**Explanation:**
- `outDir`: Builds React app to `dist/client` (matches wrangler config)
- `proxy`: Routes `/api/*` requests to Wrangler dev server during development

## Step 9: Create HTML Entry Point

Create [index.html](index.html) in the root:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Worker Fullstack</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/client/main.tsx"></script>
  </body>
</html>
```

## Step 10: Create Backend Server

Create [src/server/index.ts](src/server/index.ts):

```typescript
import { Hono } from 'hono';

const app = new Hono();

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

export default app;
```

## Step 11: Create React Frontend

### Create Main Entry File

Create [src/client/main.tsx](src/client/main.tsx):

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### Create App Component

Create [src/client/App.tsx](src/client/App.tsx):

```typescript
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Cloudflare Workers + Hono + React</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}

export default App;
```

### Create Basic Styles

Create [src/client/index.css](src/client/index.css):

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

Create [src/client/App.css](src/client/App.css):

```css
.App {
  text-align: center;
}

.App h1 {
  font-size: 3rem;
  color: #f38020;
}

.App p {
  font-size: 1.5rem;
  color: #333;
}
```

## Step 12: Test Locally

### Start Backend Server (Terminal 1)

```bash
npm run dev:worker
```

This starts the Wrangler dev server on `http://localhost:8787`

### Start Frontend Dev Server (Terminal 2)

```bash
npm run dev
```

This starts Vite on `http://localhost:5173`

### Test the Application

Open your browser to `http://localhost:5173`. You should see:
- The heading "Cloudflare Workers + Hono + React"
- A message "Hello from Hono!" fetched from the API

## Step 13: Build for Production

```bash
npm run build
```

This builds your React app to `dist/client/`.

## Step 14: Preview Production Build Locally

```bash
wrangler dev
```

This runs your Worker with the built static assets. Visit `http://localhost:8787` to test.

## Step 15: Deploy to Cloudflare Workers

### Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authenticate.

### Deploy

```bash
npm run deploy
```

Or manually:

```bash
npm run build
npx wrangler deploy
```

### Access Your Application

After deployment, Wrangler will provide a URL like:
```
https://worker-fullstack.<your-subdomain>.workers.dev
```

Visit this URL to see your live application!

## Step 16: Configure Custom Domain (Optional)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Select your worker
4. Go to **Settings** → **Triggers**
5. Click **Add Custom Domain**
6. Enter your domain and follow the instructions

---

## Project Structure Overview

```
worker-fullstack/
├── src/
│   ├── client/              # React frontend
│   │   ├── App.tsx          # Main React component
│   │   ├── App.css          # Component styles
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles
│   └── server/              # Hono backend
│       └── index.ts         # API routes
├── dist/
│   └── client/              # Built React app (generated)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # Node TypeScript config
├── vite.config.ts           # Vite configuration
└── wrangler.jsonc           # Cloudflare Workers config
```

---

## How It Works

### Development Mode
1. **Vite Dev Server** (`npm run dev`): Serves React app with HMR
2. **Wrangler Dev** (`npm run dev:worker`): Runs Hono API locally
3. **Vite Proxy**: Routes `/api/*` requests from Vite to Wrangler

### Production Mode
1. **Build**: Vite builds React to `dist/client/`
2. **Deploy**: Wrangler deploys Worker with built assets
3. **Cloudflare Workers**: Serves both API routes and static files from the edge

---

## Adding More API Routes

Edit [src/server/index.ts](src/server/index.ts):

```typescript
app.get('/api/users', (c) => {
  return c.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.post('/api/data', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});
```

---

## Common Issues & Solutions

### Issue: API calls fail in development
**Solution**: Make sure both `npm run dev` and `npm run dev:worker` are running.

### Issue: 404 errors in production
**Solution**: Ensure `npm run build` was run before `wrangler deploy`.

### Issue: Static assets not loading
**Solution**: Check that `wrangler.jsonc` has the correct `assets.directory` path (`./dist/client`).

### Issue: TypeScript errors
**Solution**: Run `npm install` to ensure all type definitions are installed.

---

## Next Steps

- Add a database with [Cloudflare D1](https://developers.cloudflare.com/d1/)
- Implement authentication
- Add more complex API routes
- Set up CI/CD with GitHub Actions
- Use Cloudflare KV for caching
- Add Cloudflare R2 for object storage

---

## Useful Commands

```bash
# Development
npm run dev              # Start frontend dev server
npm run dev:worker       # Start backend dev server

# Production
npm run build            # Build frontend
npm run deploy           # Build and deploy to Cloudflare

# Wrangler Commands
npx wrangler login       # Login to Cloudflare
npx wrangler whoami      # Check login status
npx wrangler tail        # View live logs
npx wrangler dev         # Test production build locally
```

---

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)

---

**Congratulations!** 🎉 You now have a full-stack application running on Cloudflare Workers with a React frontend and Hono backend.
