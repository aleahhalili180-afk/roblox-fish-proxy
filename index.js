const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

app.post('/get-audio-bytes', async (req, res) => {
    const { text, voice_id } = req.body;

    if (!text || !voice_id) {
        return res.status(400).json({ success: false, error: "Missing text or voice_id" });
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
                reference_id: voice_id,
                format: 'pcm',
                sample_rate: 16000,
                latency: 'normal'
            },
            responseType: 'arraybuffer'
        });

        const base64String = Buffer.from(response.data).toString('base64');
        return res.json({ success: true, audioData: base64String });

    } catch (error) {
        console.error("Proxy error context:");
        if (error.response) {
            console.error(error.response.status, error.response.data.toString());
        } else {
            console.error(error.message);
        }
        // Always return valid JSON back to Roblox so it doesn't crash on decode
        return res.status(500).json({ success: false, error: "Backend failure" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy online!'));
