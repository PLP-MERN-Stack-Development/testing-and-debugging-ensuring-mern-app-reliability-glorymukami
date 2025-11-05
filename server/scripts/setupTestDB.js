import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const setupTestDB = async () => {
  try {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    console.log('Connected to test database');

    // Clear existing data
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('Test database cleared');

    // Optionally seed with test data
    console.log('Test database setup completed');
    
    await mongoose.disconnect();
    console.log('Disconnected from test database');
    
  } catch (error) {
    console.error('Test database setup failed:', error);
    process.exit(1);
  }
};

setupTestDB();
