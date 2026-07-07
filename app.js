async function handleChatSubmit() {
    const promptInput = document.getElementById("user-prompt");
    // Target the code line display area inside the tab layout
    const responseLine = document.querySelector(".code-line || #ai-response");
    
    if (!promptInput) return;
    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert("Please type a message first!");
        return;
    }

    if (responseLine) {
        responseLine.innerText = "// Connecting to DeepSeek cloud... Analyzing request structure...";
    }
    promptInput.value = "";

    try {
        const response = await fetch("https://freebuff-bqdi.onrender.com/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-v4-flash",
                messages: [{ role: "user", content: promptText }],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Server status error: ${response.status}`);
        }

        const data = await response.json();
        let aiOutput = "";

        if (data.message && data.message.content) {
            aiOutput = data.message.content;
        } else if (data.response) {
            aiOutput = data.response;
        } else {
            aiOutput = JSON.stringify(data, null, 2);
        }

        if (responseLine) {
            responseLine.innerText = aiOutput;
        }

    } catch (error) {
        console.error("Error:", error);
        if (responseLine) {
            responseLine.innerText = `// Connection Blocked: ${error.message}\n// Hint: Make sure CORS middleware is enabled on your Render service server.js file.`;
        }
    }
}
