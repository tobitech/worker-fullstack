import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

const app = new Hono();

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

// Serve static files (React build)
app.get('*', serveStatic({ root: './' }));

export default app;
