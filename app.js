// app.js (Frontend)
const sendButton = document.getElementById("send-button");
const userInput = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

function handleSubmit(e)
{
    e.preventDefault();
}

sendButton.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;

  // Display user message in chat log
  const userMessage = document.createElement("p");
  userMessage.textContent = input;
  userMessage.className = "user";
  chatLog.appendChild(userMessage);
  chatLog.scrollTop = chatLog.scrollHeight;

  // Clear the input box
  userInput.value = '';

  try {
    // Call the backend API
    const response = await fetch("http://localhost:3000/ask-bmi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: input })
    });

    const data = await response.json();
    if (data.response) {
      // Display chatbot response in chat log
      const botMessage = document.createElement("p");
      botMessage.textContent = data.response;
      botMessage.className = "bot";
      chatLog.appendChild(botMessage);
      chatLog.scrollTop = chatLog.scrollHeight;
    } else {
      // Handle error response
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Something went wrong. Please try again.";
      errorMessage.className = "bot";
      chatLog.appendChild(errorMessage);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  } catch (error) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Something went wrong. Please try again.";
    errorMessage.className = "bot";
    chatLog.appendChild(errorMessage);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
