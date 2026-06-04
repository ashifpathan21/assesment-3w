import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import { connectDB } from './config/db.js';
connectDB()
const app = express();

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URI || 'http://localhost:5173'
}))


export default app