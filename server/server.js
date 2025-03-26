const express = require('express');
//const cors = require('cors');

const PORT = 3000;

const app = express();
//app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Hello World!' });
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });