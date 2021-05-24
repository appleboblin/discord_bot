// requirements
const mongoose = require('mongoose');

// connects to server
module.exports = async () => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};

/*
// Mac config file path: /usr/local/etc/mongod.conf
// Windows config file path: <install directory>\bin\mongod.cfg.
// Linux config file path : /etc/mongod.conf

// config: mongodb://localhost:27017/discordbot
// online: mongodb+srv://username:<password>@discord-bot.uaksl.mongodb.net/discord_bot
*/
