const {validateAccessToken} = require('../service/validation-tokens');

module.exports = function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(res.status(401).send('не авторизован'));
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(res.status(401).send('не авторизован'));
    }
    const userData = validateAccessToken(accessToken);
    if (!userData) {
      return next(res.status(401).send('не авторизован'));
    }
    req.user = userData;
    next();
  } catch (error) {
    return next(res.status(401).send('не авторизован'));
  }
};
