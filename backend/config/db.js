const mongoose = require('mongoose');

// Detect if the MONGO_URI is a real Atlas connection string or still a placeholder
const isPlaceholderURI = (uri) => {
  if (!uri) return true;
  return uri.includes('<username>') || uri.includes('<password>');
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  const useFallback =
    isPlaceholderURI(mongoURI) && process.env.NODE_ENV !== 'production';

  if (useFallback) {
    console.log(
      '⚠️  No valid MONGO_URI found — starting in-memory MongoDB for development...'
    );
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(
        `✅ In-Memory MongoDB Connected: ${conn.connection.host} (dev only)`
      );
      console.log(
        '📝 To use MongoDB Atlas, update MONGO_URI in your .env file.'
      );
      // Store reference so it can be stopped on process exit
      process.on('SIGINT', async () => {
        await mongod.stop();
        process.exit(0);
      });
    } catch (error) {
      console.error(`❌ In-Memory MongoDB Error: ${error.message}`);
      process.exit(1);
    }
  } else {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB Error: ${error.message}`);
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'development') {
    console.log('⚠️  MongoDB disconnected');
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = connectDB;
