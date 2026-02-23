require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

async function getTwitchToken() {
    const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
        params: {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    });
    return response.data.access_token;
}

app.get('/api/videos', async (req, res) => {
    try {
        const token = await getTwitchToken();
        const response = await axios.get(`https://api.twitch.tv/helix/videos`, {
            params: { user_id: process.env.BROADCASTER_ID, type: 'archive', first: 10 },
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

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
