async function handleChatSubmit() {
    const promptInput = document.getElementById("user-prompt");
    const responseWindow = document.getElementById("ai-response");
    
    // Check if elements exist on page
    if (!promptInput || !responseWindow) return;
    
    const promptText = promptInput.value.trim();
    if (!promptText) {
        alert("Please enter a prompt first!");
        return;
    }

    // VS Code streaming status comment layout
    responseWindow.innerText = "// Connecting to proxy... Streaming data matrix...";
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

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();
        
        // Output clean AI message text directly to screen
        if (data.message && data.message.content) {
            responseWindow.innerText = data.message.content;
        } else if (data.response) {
            responseWindow.innerText = data.response;
        } else {
            responseWindow.innerText = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        console.error("Error:", error);
        responseWindow.innerText = `// System Error: Failed to fetch model data.\n// Details: ${error.message}`;
    }
}
