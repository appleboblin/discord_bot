const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
};

const profileSchema = mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  coins: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  boxes: {
    Normal: {
      type: Number,
      default: 0,
    },
    Rare: {
      type: Number,
      default: 0,
    },
    Epic: {
      type: Number,
      default: 0,
    },
  },
  inventory: {},
});

module.exports = mongoose.model('profiles', profileSchema);
