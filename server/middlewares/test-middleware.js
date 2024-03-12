const User = require('../models/User');
const {validateAccessToken} = require('../service/validation-tokens');
const counterModel = require('../models/counter-model');
const counterController = require('../controllers/count-controller');

const userCount = async(userId) => {
  const newCount = await counterController.incrementCounter(userId);
  return newCount;
}

module.exports = function(roles) {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
    const token = req.headers.authorization.split(' ')[1];
    const userData = validateAccessToken(token);
    const {roles: userRoles, id: userId} = validateAccessToken(token);
      let hasRole = false
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true;
          if (role == 'TEST') {
            userCount(userId)
            return;
          }
        }
        if (!hasRole) {
          return res.json({message: "Ваша роль admin или user"})
        }
      })
      next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({message: "Не авторизован"})
    }
  }
}
