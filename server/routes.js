const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const router = express.Router();

// Configurations
const TELEGRAM_BOT_TOKEN = '7566501744:AAHpvMb3h5nA-arIrOHP08nOAJNpsS2WFjk';
const TELEGRAM_USER_ID = '6623831072';
const GITHUB_USERNAME = 'painglay272';
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'pitesan';

// Invite API: Generate Invite Link
router.get('/invite/generate', async (req, res) => {
    const userId = req.query.userId || '12345'; // Replace with actual user ID logic
    const inviteLink = `https://example.com/?ref=${userId}`;

    // Save to GitHub
    const inviteData = { userId, inviteLink };
    await saveToGitHub(`invites/${userId}.json`, inviteData);

    res.json({ success: true, link: inviteLink });
});

// Withdraw API
router.post('/withdraw', async (req, res) => {
    const { amount, method, account } = req.body;

    // Load user data
    const usersPath = '../database/users.json';
    const users = JSON.parse(fs.readFileSync(usersPath));
    const user = users[0]; // Replace with actual user lookup

    const requiredPoints = amount * 10; // 10 points = 1 Ks
    if (user.points < requiredPoints) {
        return res.status(400).json({ success: false, error: 'Not enough points.' });
    }

    user.points -= requiredPoints;
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    // Notify via Telegram
    const message = `Withdraw Request:
    Amount: ${amount} Ks
    Method: ${method}
    Account: ${account}`;
    await sendTelegramNotification(message);

    res.json({ success: true, points: user.points });
});

// GitHub Save Function
async function saveToGitHub(path, data) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`;
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `token ${GITHUB_TOKEN}` },
        body: JSON.stringify({ message: 'Save Data', content })
    });
}

// Telegram Notification
async function sendTelegramNotification(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_USER_ID, text: message })
    });
}

module.exports = router;