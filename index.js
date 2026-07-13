const express = require('express');
const axios = require('axios');
const app = express();

const FISH_AUDIO_API_KEY = "6c3315a3448c4d6ca782ccfa7a404991";

// Clean streaming path structure
app.get('/tts/:voice_id/:text.mp3', async (req, res) => {
    const { voice_id, text } = req.params;

    try {
        const decodedText = decodeURIComponent(text);

        const response = await axios({
            method: 'post',
            url: 'https://api.fish.audio/v1/tts',
            headers: {
                'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                text: decodedText,
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

app.listen(process.env.PORT || 3000, () => console.log('Proxy is active!'));
