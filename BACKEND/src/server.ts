import 'dotenv/config'
import { connectDB } from './config/db.js';
connectDB()
import express from 'express';
import cors from 'cors'
import RouterV1 from './routes/route.js'

const app = express();

app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URI || 'http://localhost:5173'
}))
app.use('/api/v1', RouterV1)

export default app