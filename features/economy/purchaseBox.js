const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');
const { Channel, Message } = require('discord.js');

const boxCache = {}; // { 'guildId-userId': boxType }

module.exports = (client) => {};

module.exports.addBox = async (guildId, userId, boxToAdd) => {
  //logger.info('Running findOneAndUpdate()');
  let type =
    // Convert first character to capital
    boxToAdd.toString().charAt(0).toUpperCase() + boxToAdd.toString().slice(1);
  let box = `boxes.${type}`;
  // add box
  const result = await profileSchema.findOneAndUpdate(
    {
      guildId,
      userId,
    },
    {
      guildId,
      userId,
      $inc: {
        [box]: 1,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  // make string look presentable
  let total = JSON.stringify(result._doc.boxes);
  // using regular expression
  let inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');
  logger.info(
    `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, box: ${inventory}`
  );
  // caching
  boxCache[`${guildId}-${userId}`] = result._doc.boxes;

  return inventory;
};
