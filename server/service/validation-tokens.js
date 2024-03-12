const jwt = require('jsonwebtoken');

module.exports.validateAccessToken = function(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
}
