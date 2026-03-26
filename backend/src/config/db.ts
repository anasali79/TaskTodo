import mongoose from 'mongoose';

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`MongoDB Connection Error: ${message}`);
    process.exit(1);
  }
}

export default connectDB;
