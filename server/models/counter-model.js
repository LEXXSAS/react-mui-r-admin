const {Schema, model} = require('mongoose');

const CountSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  count: {
    type: Number,
  }
}, {versionKey: false})

module.exports = model('Counter', CountSchema, 'counter');
