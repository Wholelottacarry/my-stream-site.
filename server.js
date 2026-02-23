require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Serves your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fetches Twitch data
app.get('/api/videos', async (req, res) => {
    try {
        const resToken = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        const token = resToken.data.access_token;

        const response = await axios.get('https://api.twitch.tv/helix/videos', {
            params: { user_id: process.env.BROADCASTER_ID, first: 20 },
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`SYSTEM ONLINE ON PORT ${PORT}`);
});
