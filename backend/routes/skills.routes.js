const express = require('express');
const router = express.Router();
const { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  toggleVisibility 
} = require('../controllers/skills.controller');
const { protect } = require('../middleware/auth');

// Public route
router.get('/', getSkills);

// Protected routes
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);
router.patch('/:id/visibility', protect, toggleVisibility);

module.exports = router;
