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
