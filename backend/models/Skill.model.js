const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Languages', 'Frontend', 'Backend', 'Data & ML', 'Databases', 'Tools'],
    required: true,
  },
  proficiency: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  icon: {
    type: String,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
