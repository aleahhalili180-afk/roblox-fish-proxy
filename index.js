const express = require('express');
const axios = require('axios');
const app = express();

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

app.get('/tts', async (req, res) => {
    const { text, voice_id } = req.query;

    if (!text || !voice_id) {
        return res.status(400).send("Missing text or voice_id parameters");
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
            responseType: 'stream'
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        response.data.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating TTS");
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy is running!'));
