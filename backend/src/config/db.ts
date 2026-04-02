import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to mongodb..........');
    } catch (error) {
        console.error('Error connecting mongodb:', error);
        process.exit(1);
    }
};

export default connectDB;