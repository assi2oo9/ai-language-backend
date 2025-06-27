const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI kalit bilan ulanish
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI orqali test yaratish endpoint
app.post("/generate-test", async (req, res) => {
  const { language, level } = req.body;

  const prompt = `Foydalanuvchiga ${language} tilidan ${level} darajasida 3 ta test savoli tuz. Har bir savol uchun 4 ta variant ber, bitta to'g'ri javobni ko'rsat. Q&A formatda yoz.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices[0].message.content;
    res.json({ test: response });
  } catch (error) {
    console.error("❌ Xatolik:", error);
    res.status(500).json({ error: "AI so‘rovda xatolik yuz berdi." });
  }
});

// Portni belgilash (Render.com yoki lokalda)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
