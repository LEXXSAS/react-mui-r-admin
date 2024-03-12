const {Schema, model} = require('mongoose');

const userScheme = new Schema({
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
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = model('User', userScheme);
