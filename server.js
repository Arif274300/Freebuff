const express = require('express');
const http = require('http');

const app = express();
app.use(express.json());

// ⚡ COMPLETE CORS SYSTEM - Allows your GitHub Pages site to read data cleanly
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Root check endpoint
app.get('/', (req, res) => {
    res.send({ status: "online", service: "freebuff-proxy-core" });
});

// Proxy Chat router endpoint
app.post('/api/chat', (req, res) => {
    const postData = JSON.stringify(req.body);
    
    const options = {
        hostname: 'localhost', // or your specific internal Ollama network endpoint
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
        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode).send(body);
        });
    });

    proxyReq.on('error', (e) => {
        res.status(500).send({ error: "Ollama offline or unreachable", details: e.message });
    });

    proxyReq.write(postData);
    proxyReq.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server executing safely on port ${PORT}`);
});
