const express = require('express');
const router = express.Router();
const { 
  getTimeline, 
  createTimelineEntry, 
  updateTimelineEntry, 
  deleteTimelineEntry, 
  reorderTimeline 
} = require('../controllers/timeline.controller');
const { protect } = require('../middleware/auth');
const { createTimelineRules, updateTimelineRules, reorderRules, idParamRules } = require('../middleware/validate');

// Public route
router.get('/', getTimeline);

// Protected routes
router.post('/', protect, createTimelineRules, createTimelineEntry);
router.put('/:id', protect, updateTimelineRules, updateTimelineEntry);
router.delete('/:id', protect, idParamRules, deleteTimelineEntry);
router.patch('/reorder', protect, reorderRules, reorderTimeline);

module.exports = router;
