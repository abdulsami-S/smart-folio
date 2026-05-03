const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  githubUrl: {
    type: String,
  },
  liveUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  visible: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
