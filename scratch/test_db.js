require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Connecting to MONGO_URI:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection successful!');
    
    // Check database write capability by trying to find/save a Portfolio doc
    const Portfolio = require('../backend/models/Portfolio.model');
    const portfolio = await Portfolio.findOne();
    if (portfolio) {
      console.log('Found portfolio:', portfolio.name);
      portfolio.tagline = portfolio.tagline + ' '; // just a minor change
      await portfolio.save();
      console.log('✅ Write/Save check successful!');
    } else {
      console.log('No portfolio document found.');
    }
  } catch (error) {
    console.error('❌ Mongoose connection/write failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
