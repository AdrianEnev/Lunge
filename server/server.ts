import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';

const app = express();
dotenv.config();

const PORT = process.env.BACKEND_PORT || 3000;

app.get('/api', (req, res) => {
    res.send('API is running');
});

app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});