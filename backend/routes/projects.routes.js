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

// Public route (with different behavior based on auth status handled in controller)
router.get('/', getProjects);

// Protected routes
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/reorder', protect, reorderProjects);
router.patch('/:id/visibility', protect, toggleVisibility);

module.exports = router;
