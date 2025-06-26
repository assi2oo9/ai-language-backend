const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/generate-test', async (req, res) => {
  const { language, level } = req.body;

  const prompt = `Generate a ${level} level test with 3 multiple-choice questions to learn ${language}. Show it as Q&A format.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating test from AI.");
  }
});

app.listen(3000, () => {
  console.log('✅ AI Backend running on http://localhost:3000');
});
