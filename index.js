const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

app.post('/get-audio-bytes', async (req, res) => {
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
                format: 'pcm_s16le', // Raw 16-bit audio
                sample_rate: 16000
            },
            responseType: 'arraybuffer'
        });

        // Convert the binary audio data directly into a single compact string
        const base64String = Buffer.from(response.data).toString('base64');
        res.json({ success: true, audioData: base64String });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch audio" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy operational!'));
