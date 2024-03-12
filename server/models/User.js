const {Schema, model} = require('mongoose');

const userAndRoleScheme = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 1,
    max: 50
  },
  password: {
    type: String,
    required: true,
    min: 1,
    max: 50
  },
  roles: [{
    type: String,
    ref: 'Role'
  }]
});

module.exports = model('Users', userAndRoleScheme);
