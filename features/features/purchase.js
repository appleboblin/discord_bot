const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');
const { Channel, Message } = require('discord.js');

const boxCache = {}; // { 'guildId-userId': boxType }

module.exports = (client) => {};
module.exports.sayHi = (guildId, userId, boxToAdd) => {
  let hi = boxToAdd.toString() + guildId + userId;
  return hi;
};
module.exports.addBox = async (guildId, userId, boxToAdd) => {
  //logger.info('Running findOneAndUpdate()');
  let box = `boxes.${boxToAdd}`;
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
  console.log(result._doc.boxes);
  let total = JSON.stringify(result._doc.boxes);
  console.log(total);
  logger.info(
    `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, box: ${total}`
  );

  boxCache[`${guildId}-${userId}`] = result._doc.boxes;
  let remove = total.replace(/[^:,0-9a-zA-Z]/g, '');

  return remove;
};
/*
module.exports.getBox = async (guildId, userId) => {
  const cachedValue = boxCache[`${guildId}-${userId}`];
  if (cachedValue) {
    return cachedValue;
  }
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
    boxes = result.BoxType;
  } else {
    logger.info('Inserting a document');
    await new profileSchema({
      guildId,
      userId,
      coins,
    }).save();
  }

  coinsCache[`${guildId}-${userId}`] = BoxType;

  return boxes;
};
*/
