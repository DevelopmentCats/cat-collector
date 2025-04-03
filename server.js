const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Create a route to serve environment variables to the client
app.get('/env.js', (req, res) => {
    const envVars = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GAME_TITLE: process.env.GAME_TITLE || 'Cat Collector - Human Edition',
        DEFAULT_TEXT_SPEED: process.env.DEFAULT_TEXT_SPEED || 'medium',
        DEFAULT_VOLUME: process.env.DEFAULT_VOLUME || 0.7,
        DEFAULT_DARK_MODE: process.env.DEFAULT_DARK_MODE || true
    };

    res.setHeader('Content-Type', 'application/javascript');
    res.send(`window.env = ${JSON.stringify(envVars)};`);
});

// Serve the main game file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Cat Collector game server running at http://localhost:${port}`);
}); 