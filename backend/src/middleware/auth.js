const jwt = require('jsonwebtoken');
const { User } = require('../ssot/schema');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
    req.user = await User.findByPk(decoded.userId); // Attach user to request
    if (!req.user) return res.sendStatus(403); // User not found
    next();
  } catch (error) {
    return res.sendStatus(403); // Invalid token
  }
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};