const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI API ulash
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: /generate-test
app.post("/generate-test", async (req, res) => {
  const { language, level } = req.body;

  const prompt = `Foydalanuvchiga ${language} tilidan ${level} darajasida 20 ta test savoli tuz. Har bir savolga 4 ta variant va to‘g‘ri javob bo‘lsin. Faqat test shaklida javob qaytar.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

   const result = completion.choices[0].message.content;
    res.json({ test: result });


  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ error: "AI so‘rovda xatolik yuz berdi" });
  }
});

// Portni eshitish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
