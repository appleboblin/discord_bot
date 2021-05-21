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
    //adding xp
    addXP(guild.id, member.id, XP, message);
  });
};

const getNeededXP = (level) => level * level * 100;

const addXP = async (guildId, userId, xpToAdd, message) => {
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
};

module.exports.addXP = addXP;
