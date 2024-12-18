require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Generates a unique ID
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser())

console.log(process.env.FE_URL)
const members = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' },
];
app.get('/generate-qr/:id', async (req, res) => {
    try {
        // Generate a unique ID
        const uniqueId = uuidv4();
        const {id} = req.params
        const baseUrl = process.env.FE_URL;
        const urlWithId = `${baseUrl}?uniqueId=${id}`;
        // Generate QR code for the URL
        const qrCode = await QRCode.toDataURL(urlWithId);

        res.json({ qrCode, uniqueId, url: urlWithId });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});
app.get('/members', (req, res) => {
    res.json(members);
});

app.get('/members/:id', (req, res) => {
    const member = members.find((m) => m.id === parseInt(req.params.id));
    if (!member) {
        return res.status(404).send('Member not found');
    }
    res.json(member);
});


app.get('/scan', (req, res) => {
    const { uniqueId } = req.query;

    if (!uniqueId) {
        return res.status(400).send('Unique ID is missing!');
    }

    // Placeholder: Fetch or process based on the unique ID
    res.send(`Scanned successfully with unique ID: ${uniqueId}`);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

  try {

    if (username === "Admin" && password === "Admin$9876") {
      const token = jwt.sign({ id: username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        username: username,
        token,
      })
    } else {
   throw new Error('Invalid credentials' );
    }
  } catch (error) {
    const statusCode = error.statusCode || 500
    res.status(statusCode).send({
        success: false,
        error: error.message || error
    })
  }
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
