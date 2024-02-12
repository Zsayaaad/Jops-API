const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];
  // console.log(token);

  try {
    // Check on the token that has send from client-side valid or not
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    req.user = { userId: payload.userId, name: payload.name }; // From UserSchema
    // console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

module.exports = authMiddleware;
