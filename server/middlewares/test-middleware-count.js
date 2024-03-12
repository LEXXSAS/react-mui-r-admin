const User = require('../models/User');

module.exports = function(roles) {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
      const userName = req.body.username;
      const user = User.findOne({userName});

      console.log(user)

      next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({message: "Не авторизован"})
    }
  }
}
