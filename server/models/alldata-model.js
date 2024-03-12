const {Schema, model} = require('mongoose');

const allUserSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  age: {
    type: Number
  },
  desc: {
    type: String
  }
}, {versionKey: false});

module.exports = model('Alldata', allUserSchema, 'alldata');
