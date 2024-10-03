const jwt = require('jsonwebtoken');

const authenticate = (req) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return { userId: decoded.userId };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  return {};
};

module.exports = authenticate;
