require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. PUBLIC ACCESS SETTINGS
app.use(cors());
app.use(express.static(path.join(__dirname)));

// 2. TWITCH CONNECTION ENGINE
async function getTwitchToken() {
    try {
        const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        return res.data.access_token;
    } catch (err) {
        return null;
    }
}

// 3. THE DATA ROUTE
app.get('/api/videos', async (req, res) => {
    try {
        const token = await getTwitchToken();
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

// 4. THE CLOUD PORT FIX (CRITICAL)
// This line swaps 'localhost' for the Render Public URL
const PORT = process.env.PORT || 10000; 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================`);
    console.log(`WHOLELOTTACARRY ARCHIVE IS LIVE`);
    console.log(`SYSTEM ONLINE ON PORT: ${PORT}`);
    console.log(`====================================`);
});
