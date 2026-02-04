import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import connectDB from './config/db.js';

dotenv.config(); 
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.send('Backend is Up and Running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});