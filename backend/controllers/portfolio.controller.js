const Portfolio = require('../models/Portfolio.model');

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: 'Portfolio data not found' });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio(req.body);
      await portfolio.save();
    } else {
      portfolio = await Portfolio.findByIdAndUpdate(portfolio._id, req.body, { new: true });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPortfolio,
  updatePortfolio
};
