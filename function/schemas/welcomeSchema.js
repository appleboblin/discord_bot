// requirements
const mongoose = require('mongoose');

const reqString = {
  // Primary key: type
  type: String,
  required: true,
};

// format
const welcomeSchema = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
  text: reqString,
});

module.exports = mongoose.model('welcome-channels', welcomeSchema);
