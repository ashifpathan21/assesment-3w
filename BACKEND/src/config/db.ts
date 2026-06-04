import 'dotenv/config'
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database')
    } catch (error) {
        console.error('Error Connecting Database');
        console.error(error)
    }
}