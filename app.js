// Auto-resize input container like real chat applications
const tx = document.getElementById("user-prompt");
if (tx) {
    tx.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });
}

async function handleChatSubmit() {
    const promptInput = document.getElementById("user-prompt");
    const chatContainer = document.getElementById("chat-container");
    const runBtn = document.getElementById("run-btn");
    
    if (!promptInput || !chatContainer || !runBtn) return;
    
    const promptText = promptInput.value.trim();
    if (!promptText) return;

    // Disable UI during transmission
    runBtn.disabled = true;
    promptInput.value = "";
    promptInput.style.height = "auto";

    // 1. Append User Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "message user-message";
    userDiv.innerText = promptText;
    chatContainer.appendChild(userDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 2. Append Connecting Status Pill
    const statusDiv = document.createElement("div");
    statusDiv.className = "system-status";
    statusDiv.id = "active-status-pill";
    statusDiv.innerText = "Running model request...";
    chatContainer.appendChild(statusDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch("https://freebuff-bqdi.onrender.com/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek-v4-flash",
                messages: [{ role: "user", content: promptText }],
                stream: false
            })
        });

        // Drop the status indicator safely
        const pill = document.getElementById("active-status-pill");
        if (pill) pill.remove();

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        let aiOutput = "";
        if (data.message && data.message.content) {
            aiOutput = data.message.content;
        } else if (data.response) {
            aiOutput = data.response;
        } else {
            aiOutput = JSON.stringify(data, null, 2);
        }

        // 3. Append Model Response Bubble
        const modelDiv = document.createElement("div");
        modelDiv.className = "message model-message";
        modelDiv.innerText = aiOutput;
        chatContainer.appendChild(modelDiv);

    } catch (error) {
        console.error(error);
        const pill = document.getElementById("active-status-pill");
        if (pill) pill.remove();

        const errorDiv = document.createElement("div");
        errorDiv.className = "message model-message";
        errorDiv.style.color = "#f2b8b5";
        errorDiv.innerText = `Error connecting to AI studio instance backend: ${error.message}`;
        chatContainer.appendChild(errorDiv);
    }

    // Re-enable input capabilities
    runBtn.disabled = false;
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
