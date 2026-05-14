import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to MongoDB successfully: ${conn.connection.host}`);

    // Drop old Clerk index if it exists to prevent duplicate key errors on registration
    try {
      await mongoose.connection.collection('users').dropIndex('clerkUserId_1');
      console.log('🧹 Cleaned up old Clerk database indexes.');
    } catch (indexErr) {
      // Ignore error if index doesn't exist
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
