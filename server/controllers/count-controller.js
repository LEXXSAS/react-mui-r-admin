const User = require("../models/User");
const counterModel = require("../models/counter-model");

class CounterController {
  async incrementCounter(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    const counterData = await counterModel.findOne({user: user._id});
    let count = 0;
    if (counterData && counterData !== null) {
      counterData.count++;
      counterData.save();
      return;
    }
    await counterModel.create({user: user._id, count});
    
  }
}

module.exports = new CounterController();
