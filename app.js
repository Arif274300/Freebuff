async function handleChatSubmit() {
    const promptText = document.getElementById("user-prompt").value;
    const responseDiv = document.getElementById("ai-response");
    
    if(!promptText) return alert("Please type a prompt!");
    
    responseDiv.innerText = "Thinking...";
    
    try {
        // Connected directly to your specific Render link!
        const RENDER_URL = "https://freebuff-bqdi.onrender.com"; 

        const response = await fetch(`${RENDER_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek-v4-flash", 
                messages: [{ role: "user", content: promptText }],
                stream: false
            })
        });

        const data = await response.json();
        responseDiv.innerText = data.message.content;
    } catch (error) {
        responseDiv.innerText = "Error: Check if your Render server is awake.";
    }
}
