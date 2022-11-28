const jwt = require('jsonwebtoken');
const { env } = require('../globals');

exports.isLoggedIn = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    return res.status(401).json({
      message: "Not authenticated",
      errors: "Please add token"
    });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decodedToken = await jwt.verify(token, env.SECRET_KEY);
    if(!decodedToken) {
      return res.status(422).json({
        message: "Not authenticated",
        errors: "Error decode token"
      });
    }
    req.userId = decodedToken.userId;
  } catch(err) {
    return res.status(500).json({
      message: "Error decode token",
      errors: err
    });
  }
  next();
}
