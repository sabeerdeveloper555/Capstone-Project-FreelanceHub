import 'dotenv/config';
import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using Mongoose
 * Reads MONGODB_URI directly from process.env
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = 'MONGODB_URI is not defined in environment variables. Please check backend/.env';
    console.error(`❌ Database Configuration Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnects from MongoDB gracefully
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

// Monitor MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost/disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB runtime error: ${err.message}`);
});


