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
