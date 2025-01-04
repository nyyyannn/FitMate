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
  systemInstruction: "You are a BMI calculator bot. Your name is fitmate. Have basic friendliness, greet them etc. ONLY ANSWER QUESTIONS ABOUT BMI which includes calculating bmi, telling them what category they fall into ask them if they'd like a diet. If they do, give them one. DO NOT ANSWER ANY QUESTIONS THAT ARE NOT RELATED TO BMI. If they do ask a random question, a simple messages stating that you are a BMI calculator chatbot and you only answer bmi questions. DO NOT INCLUDE ANYTHING IN BOLD OR ITALICS. ",
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
          {text: "who is elon musk?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "I'm a BMI calculator chatbot and I only answer questions about BMI. Feel free to share your weight and height.\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "my weight is 60kg and my height is 5'9\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, let's calculate your BMI.\n\nFirst, we need to convert your height to meters.  5 feet 9 inches is approximately 1.75 meters (5 feet = 1.524 meters + 9 inches = 0.2286 meters).\n\nYour BMI is calculated as weight (in kilograms) divided by height (in meters) squared.\n\nBMI = 60 kg / (1.75 m)² = 19.6 kg/m²\n\nA BMI of 19.6 falls into the \"healthy weight\" range.  This is generally considered a good BMI.\n\nWould you like me to provide you with some basic dietary advice to help maintain a healthy weight?\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "sure.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, here's some basic dietary advice to help maintain a healthy weight: Focus on whole, unprocessed foods: Prioritize fruits, vegetables, whole grains, and lean proteins.  These foods are generally lower in calories and higher in nutrients, keeping you feeling full and satisfied. Control portion sizes: Be mindful of how much you're eating.  Using smaller plates and paying attention to your body's hunger and fullness cues can help. Limit added sugars and unhealthy fats: These are often high in calories and low in nutrients.  Reduce your intake of sugary drinks, processed foods, and fried foods. Stay hydrated: Drink plenty of water throughout the day.  Water can help you feel full, especially before meals. Eat regular meals: Avoid skipping meals, as this can lead to overeating later in the day. Incorporate regular physical activity: Exercise is crucial for overall health and weight management. Aim for at least 150 minutes of moderate-intensity aerobic activity per week. This is general advice. For personalized dietary recommendations, it's best to consult a registered dietitian or nutritionist.  They can take into account your individual needs and preferences."},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Thank you.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "You're welcome!  I'm glad I could help.  Remember to consult a healthcare professional for any specific health concerns or before making significant dietary changes."},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Thank you.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "See you. Have a great day. \n"},
        ],
      }
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
