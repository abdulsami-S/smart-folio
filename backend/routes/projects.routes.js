const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  reorderProjects, 
  toggleVisibility 
} = require('../controllers/projects.controller');
const { protect } = require('../middleware/auth');
const { createProjectRules, updateProjectRules, reorderRules, idParamRules } = require('../middleware/validate');

// Public route (with different behavior based on auth status handled in controller)
router.get('/', getProjects);

// Protected routes
router.post('/', protect, createProjectRules, createProject);
router.put('/:id', protect, updateProjectRules, updateProject);
router.delete('/:id', protect, idParamRules, deleteProject);
router.patch('/reorder', protect, reorderRules, reorderProjects);
router.patch('/:id/visibility', protect, idParamRules, toggleVisibility);

module.exports = router;
