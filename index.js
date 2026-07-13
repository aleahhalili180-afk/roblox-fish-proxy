const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

app.post('/get-audio-data', async (req, res) => {
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
            responseType: 'arraybuffer'
        });

        // Convert the audio stream into a safe base64 string for Roblox
        const base64Data = Buffer.from(response.data, 'binary').toString('base64');
        res.json({ success: true, audioData: base64Data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch audio from Fish Audio" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy is running smoothly!'));
