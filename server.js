import express from 'express';
import cors from 'cors';

const app = express();

// Enable open cors sharing so your GitHub page can hit this endpoint cleanly
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch("https://ollama.com/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OLLAMA_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ollama Upstream Error:", errorText);
            return res.status(response.status).json({ error: "Upstream AI failure" });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Proxy Processing Error:", error);
        res.status(500).json({ error: "Internal Server Processing Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server executing successfully on port ${PORT}`));
