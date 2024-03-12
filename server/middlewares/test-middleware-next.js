const User = require('../models/User');
const {validateAccessToken} = require('../service/validation-tokens');
const counterModel = require('../models/counter-model');

const newCountFind = async(userId) => {
  const user = await User.findById(userId);
}

module.exports = function(roles) {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      const userData = validateAccessToken(token);
      const userId = userData.id;
      newCountFind(userId)
     next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({message: "Не авторизован"})
    }
  }
}
