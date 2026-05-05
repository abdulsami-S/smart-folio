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
const { createSkillRules, updateSkillRules, idParamRules } = require('../middleware/validate');

// Public route
router.get('/', getSkills);

// Protected routes
router.post('/', protect, createSkillRules, createSkill);
router.put('/:id', protect, updateSkillRules, updateSkill);
router.delete('/:id', protect, idParamRules, deleteSkill);
router.patch('/:id/visibility', protect, idParamRules, toggleVisibility);

module.exports = router;
