import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const DB_URI: string | undefined = process.env.DB_URI;

const dbConnect = async (): Promise<void> => {

    try {
        await mongoose.connect(DB_URI!)

        console.log('**Successful connection to MongoDB**');
    } catch (error) {
        console.error('***Error of connection to MongoDB: ', error);
    }
}

export default dbConnect