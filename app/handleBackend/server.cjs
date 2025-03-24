//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.VITE_REACT_APP_PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log('/')
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });