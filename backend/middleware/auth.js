const { verifyAccessToken } = require('../config/jwt');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = verifyAccessToken(token);
      req.admin = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const optionalProtect = (req, res, next) => {
  const isAdminRequest = req.query.admin === 'true';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token);
      req.admin = decoded;
      return next();
    } catch (error) {
      if (isAdminRequest) {
        return res.status(401).json({ message: 'Session expired' });
      }
    }
  } else if (isAdminRequest) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  next();
};

module.exports = { protect, optionalProtect };
