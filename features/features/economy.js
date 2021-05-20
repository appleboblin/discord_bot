const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');

const coinsCache = {}; // { 'guildId-userId': coins }

module.exports = (client) => {};

module.exports.addCoins = async (guildId, userId, coins) => {
  return await mongo().then(async (mongoose) => {
    try {
      //logger.info('Running findOneAndUpdate()');

      const result = await profileSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $inc: {
            coins,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      logger.info(
        `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, coins: ${result._doc.coins}`
      );

      coinsCache[`${guildId}-${userId}`] = result.coins;

      return result.coins;
    } finally {
      mongoose.connection.close();
    }
  });
};

module.exports.getCoins = async (guildId, userId) => {
  const cachedValue = coinsCache[`${guildId}-${userId}`];
  if (cachedValue) {
    return cachedValue;
  }

  return await mongo().then(async (mongoose) => {
    try {
      //logger.info('Running findOne()');

      const result = await profileSchema.findOne({
        guildId,
        userId,
      });

      logger.info(
        `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, coins: ${result._doc.coins}`
      );

      let coins = 0;
      if (result) {
        coins = result.coins;
      } else {
        logger.info('Inserting a document');
        await new profileSchema({
          guildId,
          userId,
          coins,
        }).save();
      }

      coinsCache[`${guildId}-${userId}`] = coins;

      return coins;
    } finally {
      mongoose.connection.close();
    }
  });
};
