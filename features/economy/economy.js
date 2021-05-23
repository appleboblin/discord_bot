const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');
const itemList = require('../../asset/shop/shopItems.json');

const coinsCache = {}; // { 'guildId-userId': coins }

module.exports = (client) => {};

const addCoins = async (guildId, userId, coins) => {
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
  // Caching
  coinsCache[`${guildId}-${userId}`] = result.coins;

  return result.coins;
};
module.exports.addCoins = addCoins;

const getCoins = async (guildId, userId) => {
  // look from cache
  const cachedValue = coinsCache[`${guildId}-${userId}`];
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
  // get result
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
  //caching
  coinsCache[`${guildId}-${userId}`] = coins;

  return coins;
};
module.exports.getCoins = getCoins;
// set box price so its available for different module, global variable instead of local
let boxPrice = [];
module.exports.checkBalance = async (guildId, userId, boxToCheck) => {
  // get remaining coin
  coins = await getCoins(guildId, userId);
  // using 1 and 0 as true or false, loop through entire array.
  // if 1, have enough funds for selected item
  let result = 0;
  // check if have enough coins to buy selected box
  itemList.shop.BoxType.map((value, index) => {
    if (
      // check if its the selected box and have enough coins
      value.item.toLowerCase().includes(boxToCheck) &&
      coins - value.price >= 0
    ) {
      // true
      boxPrice = value.price;
      result += 1;
    } else {
      // false
      result += 0;
    }
  });

  return result;
};

const removeCoins = async (guildId, userId) => {
  // get remaining coins
  const remainingCoin = await getCoins(guildId, userId);
  // take away coins needed to buy, note - before boxPrice
  const result = addCoins(guildId, userId, -boxPrice);

  return result;
};
module.exports.removeCoins = removeCoins;
