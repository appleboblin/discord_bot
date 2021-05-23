const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');

module.exports = (client) => {
  client.on('message', async (message) => {
    if (message.author.bot) return;
    const { guild, member } = message;
    // random Coins
    const randomCoins = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    Coins = randomCoins(1, 3);
    //adding coins
    addCoins(guild.id, member.id, Coins, message);
  });
};

const addCoins = async (guildId, userId, coinsToAdd, message) => {
  const result = await profileSchema.findOneAndUpdate(
    {
      guildId,
      userId,
    },
    {
      guildId,
      userId,
      $inc: {
        coins: coinsToAdd,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  let { coins } = result;
};

module.exports.addCoins = addCoins;
