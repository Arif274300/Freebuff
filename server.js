import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

// CORS headers for your frontend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Proxy Chat router
app.post('/api/chat', (req, res) => {
    const postData = JSON.stringify(req.body);
    const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        let body = '';
        proxyRes.on('data', (chunk) => body += chunk);
        proxyRes.on('end', () => res.status(proxyRes.statusCode).send(body));
    });

    proxyReq.on('error', (e) => res.status(500).send({ error: "Ollama offline", details: e.message }));
    proxyReq.write(postData);
    proxyReq.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
