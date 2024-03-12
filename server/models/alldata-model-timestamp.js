const {Schema, model} = require('mongoose');

const allUserSchematime = new Schema({
  user: {type: String, ref: 'User'},
  author: {type: String, ref: 'User'},
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
}, {timestamps: true, versionKey: false});

module.exports = model('Alldatatime', allUserSchematime, 'alldata');
