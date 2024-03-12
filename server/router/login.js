const jwt = require('jsonwebtoken');

const getUser = async(username) => {
  return {userId: 1, password: '123456', username};
};

module.exports = async (req, res) => {
  const {username, password} = req.body;

  const user = await getUser(username);

  if (user.password !== password) {
    return res.status(403).json({
      error: 'логин не верный'
    });
  }

  const token = jwt.sign(user, 'secretWord', {expiresIn: '1h'});

  res.cookie('token', token, {
    httpOnly: true,
  });

  return res.redirect('/')
}
