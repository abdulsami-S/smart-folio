const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: String,
  tagline: String,
  bio: String,
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  aboutImage: String,
  heroTitles: [String],
  resumeUrl: String,
  socials: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
