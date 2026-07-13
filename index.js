const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

// We switch to a POST request that sends back the audio data as a base64 string
app.post('/get-tts', async (req, res) => {
    const { text, voice_id } = req.body;

    if (!text || !voice_id) {
        return res.status(400).json({ error: "Missing text or voice_id" });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.fish.audio/v1/tts',
            headers: {
                'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                text: text,
                voice_id: voice_id,
                format: 'mp3'
            },
            responseType: 'arraybuffer' // Get raw binary data
        });

        // Convert the audio binary into a base64 string Roblox can read
        const base64Audio = Buffer.from(response.data, 'binary').toString('base64');
        res.json({ audioData: base64Audio });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate TTS" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy is running!'));
