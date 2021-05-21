const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');

module.exports = (client) => {
  client.on('message', async (message) => {
    const { guild, member } = message;
    // random XP
    const randomXp = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    XP = randomXp(11, 26);
    // random Coins
    const randomCoins = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };
    Coins = randomCoins(1, 3);
    //adding stats
    addStats(guild.id, member.id, XP, Coins, message);
  });
};

const getNeededXP = (level) => level * level * 100;

const addStats = async (guildId, userId, xpToAdd, coinsToAdd, message) => {
  // connect to database
  await mongo().then(async (mongoose) => {
    try {
      const result = await profileSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $inc: {
            xp: xpToAdd,
            coins: coinsToAdd,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      let { xp, level } = result;
      const needed = getNeededXP(level);

      if (xp >= needed) {
        ++level;
        xp -= needed;

        message.reply(
          `You are now level ${level} with ${xp} experience! You now need ${getNeededXP(
            level
          )} XP to level up again.`
        );

        await profileSchema.updateOne(
          {
            guildId,
            userId,
          },
          {
            level,
            xp,
          }
        );
      }
    } catch {
      return;
    } finally {
      mongoose.connection.close();
    }
  });
};

module.exports.addStats = addStats;
