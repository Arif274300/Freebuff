async function handleChatSubmit() {
    const promptInput = document.getElementById("user-prompt");
    const responseWindow = document.getElementById("ai-response");
    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert("Please enter a prompt first!");
        return;
    }

    // Show loading text in the VS Code terminal window layout
    responseWindow.innerText = "// Connecting to proxy... Analyzing matrix and streaming data...";
    promptInput.value = "";

    try {
        // Pointing directly to your working Render URL
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
            throw new Error(`Server returned status code: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle output response from server data formatting structure
        if (data.message && data.message.content) {
            responseWindow.innerText = data.message.content;
        } else if (data.response) {
            responseWindow.innerText = data.response;
        } else {
            responseWindow.innerText = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        console.error("Error:", error);
        responseWindow.innerText = `// System Error: Failed to retrieve data from cloud.\n// Details: ${error.message}`;
    }
}
