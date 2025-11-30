/**
 * File: src/middleware/auth.js
 * Description: Express middleware to verify JWTs and populate `req.userId`
 * and `req.user` for downstream handlers.
 */

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support multiple token payload shapes. The app signs tokens with { userId, email }
    // but some places expect req.userId or req.user.id — populate both.
    const userId = decoded.userId || decoded.user?.id || decoded.user?.userId || decoded.id;
    const email = decoded.email || decoded.user?.email;

    req.userId = userId;
    req.user = { id: userId, email, userId };
    req.tokenPayload = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
