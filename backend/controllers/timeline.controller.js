const Timeline = require('../models/Timeline.model');

const getTimeline = async (req, res) => {
  try {
    const timeline = await Timeline.find().sort({ order: 1 });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimelineEntry = async (req, res) => {
  try {
    const entry = await Timeline.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTimelineEntry = async (req, res) => {
  try {
    const entry = await Timeline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTimelineEntry = async (req, res) => {
  try {
    const entry = await Timeline.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reorderTimeline = async (req, res) => {
  try {
    const items = req.body; // Array of { id, order }
    for (const item of items) {
      await Timeline.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Timeline reordered' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTimeline,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
  reorderTimeline
};
