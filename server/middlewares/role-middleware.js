const {validateAccessToken} = require('../service/validation-tokens');

module.exports = function(roles) {
  return function(req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
    const token = req.headers.authorization.split(' ')[1];
    const {roles: ourRole} = validateAccessToken(token);
      let hasRole = false
      ourRole.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true
        }
        if (!hasRole) {
          return res.status(403).json({message: "У вас нет доступа"})
        }
      })
      next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({message: "Не авторизован"})
    }
  }
}
