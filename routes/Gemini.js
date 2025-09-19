
const express = require('express');
const router = express.Router();
router.use(express.json());
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


router.get('/', (req, res) => {
    res.send('Gemini API is running');
    });
router.post('/chat', async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'History array is required' });
    }

    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const lastUserMessage = formattedHistory.pop();
    if (!lastUserMessage || lastUserMessage.role !== 'user') {
        return res.status(400).json({ error: 'The last message in the history must be from the user.' });
    }

    const chat = model.startChat({
      history: formattedHistory, 
    });

    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const response = result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json( error.message );
  }
});

module.exports = router;