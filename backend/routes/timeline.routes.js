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

// Public route
router.get('/', getTimeline);

// Protected routes
router.post('/', protect, createTimelineEntry);
router.put('/:id', protect, updateTimelineEntry);
router.delete('/:id', protect, deleteTimelineEntry);
router.patch('/reorder', protect, reorderTimeline);

module.exports = router;
