const express = require('express');
const { google } = require('googleapis');
const keys = require('./keys.json');

const app = express();
const port = 3000;

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        await client.authorize();
        const gsapi = google.sheets({ version: 'v4', auth: client });
        const opt = {
            spreadsheetId: '1hAW7oSlCc4ZP5YP5NptH7QB_13qrIFVIw5iUNKhbcew',
            range: 'Arkusz1!A1:B5'
        };
        let data = await gsapi.spreadsheets.values.get(opt);
        res.render('index', { data: data.data.values });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
