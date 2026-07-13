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
                'Content-Type': 'application/json',
                // Using the state-of-the-art developer tier engine
                'model': 's2.1-pro-free' 
            },
            data: {
                text: text,
                reference_id: voice_id, // Map it to Fish Audio's exact parameter requirement
                format: 'pcm',          // Requesting raw waveforms
                sample_rate: 16000
            },
            responseType: 'arraybuffer'
        });

        // Pack the audio binary stream into a small network transmission string
        const base64String = Buffer.from(response.data).toString('base64');
        res.json({ success: true, audioData: base64String });

    } catch (error) {
        // Log the exact internal failure explanation to your Render Dashboard
        if (error.response) {
            console.error("Fish Audio Error Status:", error.response.status);
            console.error("Fish Audio Error Body:", error.response.data.toString());
        } else {
            console.error("Proxy System Error:", error.message);
        }
        res.status(500).json({ error: "Failed to fetch audio from backend service" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy operational!'));
