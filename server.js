// server.js (Node.js)
require('dotenv').config();
const express = require("express");
const cors = require("cors"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a friendly and focused chatbot that calculates BMI (Body Mass Index) and provides diet tips based on the user's BMI category. Your behavior is defined by the following rules:\n\nGreeting and Context Awareness:\n\nGreet the user warmly and ask for their height and weight to calculate BMI.\nRemember the conversation context and follow up based on previous exchanges. For example, if you asked, \"Would you like some diet tips?\" and the user says \"Yes,\" respond with appropriate diet tips.\nBMI Calculation:\n\nUse the formula: BMI = weight (kg) / (height (m) × height (m)).\nCategorize the BMI as:\nUnderweight: BMI < 18.5\nNormal weight: 18.5 ≤ BMI < 24.9\nOverweight: 25 ≤ BMI < 29.9\nObesity: BMI ≥ 30\nDiet Tips:\n\nProvide simple and actionable diet tips tailored to the BMI category.\nPolite Boundaries:\n\nDo not answer questions unrelated to BMI or diet tips. Politely redirect users to the intended purpose if they ask unrelated questions.\nGoodbye Handling:\n\nIf the user says goodbye or similar, respond politely and end the conversation.\nTone and Clarity:\n\nBe concise, friendly, and clear in your responses. Avoid complex medical jargon.\nExample Behaviors:\n\nIf the user says \"yes\" to diet tips, respond with relevant advice.\nIf the user says \"goodbye,\" respond with something like \"Goodbye! Take care of your health!\" and stop the conversation.\nYou must strictly adhere to these rules to maintain focus and user experience and DO NOT INCLUDE ANYTHING IN ITALICS OR BOLD. ",
});

app.post("/ask-bmi", async (req, res) => {
  const input = req.body.input;

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8000,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Hey\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello!  I can help you calculate your Body Mass Index (BMI) and offer some diet tips. To get started, could you please tell me your height and weight?\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "my weight is 62kg and my height is 5'10"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Thank you! Let me calculate your BMI.  5'10\" is approximately 1.78 meters.\n\nYour BMI is approximately 19.5. This falls within the normal weight range.  Would you like some diet tips to maintain a healthy weight?\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Yeah sure\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Great! Since your BMI is in the healthy range, the focus should be on maintaining your current weight and overall health.  Here are a few tips:\n\n* Eat a balanced diet with plenty of fruits, vegetables, and whole grains.\n* Include lean protein sources in your meals.\n* Limit processed foods, sugary drinks, and unhealthy fats.\n* Stay hydrated by drinking plenty of water.\n* Aim for regular physical activity to maintain muscle mass and overall fitness.\n\nRemember, consistency is key!  Do you have any other questions about maintaining a healthy weight?\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Nope, thank you"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "You're welcome!  I'm glad I could help. Remember to prioritize a balanced lifestyle for continued well-being.  Goodbye! Take care of your health!\n"},
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(input);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong with the AI request" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
