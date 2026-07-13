const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: '10mb' }));

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

app.post('/get-audio-pcm', async (req, res) => {
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
                format: 'pcm_s16le', // Request raw PCM audio data instead of MP3
                sample_rate: 16000
            },
            responseType: 'arraybuffer'
        });

        // Convert the raw binary PCM data to integers so Roblox can inject it into an audio buffer
        const buffer = Buffer.from(response.data);
        const pcmSamples = [];
        for (let i = 0; i < buffer.length; i += 2) {
            pcmSamples.push(buffer.readInt16LE(i));
        }

        res.json({ success: true, samples: pcmSamples, sampleRate: 16000 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch audio from Fish Audio" });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy is ready for raw data distribution!'));
