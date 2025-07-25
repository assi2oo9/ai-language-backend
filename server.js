const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-test", async (req, res) => {
  const { language, level } = req.body;

  // Validate input
  if (!language || !level) {
    return res.status(400).json({ error: "language va level talab qilinadi" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Foydalanuvchiga ${language} tilidan ${level} darajasida 3 ta savol tuz.`,
        },
      ],
    });

    const test = completion.choices[0].message.content;
    res.json({ test });
  } catch (error) {
    console.error("❌ Xatolik:", error);
    res.status(500).json({
      error: "AI so‘rovda xatolik yuz berdi",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
});
