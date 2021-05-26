const mongo = require('../../util/mongo');
const profileSchema = require('../../schemas/profileSchema');
const logger = require('../../util/logger');
const itemList = require('../../asset/shop/shopItems.json');

const coinsCache = {}; // { 'guildId-userId': coins }
const boxCache = {}; // { 'guildId-userId': boxType }
const inventoryCache = {}; // { 'guildId-userId': inventory }

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
      value.item.toString().toLowerCase().includes(boxToCheck) &&
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

const removeCoins = async (guildId, userId, boxToCheck) => {
  // get remaining coins
  const remainingCoin = await getCoins(guildId, userId);
  // take away coins needed to buy, note - before boxPrice
  const result = addCoins(guildId, userId, -boxPrice);

  return result;
};
module.exports.removeCoins = removeCoins;

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

module.exports.getBox = async (guildId, userId) => {
  // look from cache
  const cachedValue = boxCache[`${guildId}-${userId}`];
  if (cachedValue) {
    return cachedValue;
  }
  //logger.info('Running findOne()');

  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  // make string look presentable
  let total = JSON.stringify(result._doc.boxes);
  // using regular expression
  let inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');
  logger.info(
    `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, box: ${inventory}`
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
  // caching
  boxCache[`${guildId}-${userId}`] = result._doc.boxes;

  return result._doc.boxes;
};

module.exports.removeBox = async (guildId, userId, boxToAdd) => {
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
        [box]: -1,
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

module.exports.getInventory = async (guildId, userId) => {
  // look from cache
  const cachedValue = inventoryCache[`${guildId}-${userId}`];
  if (cachedValue) {
    return cachedValue;
  }
  //logger.info('Running findOne()');

  const result = await profileSchema.findOne({
    guildId,
    userId,
  });
  // make string look presentable
  let total = JSON.stringify(result._doc.inventory);
  // using regular expression
  let inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');
  logger.info(
    `RESULT: guildId: ${result._doc.guildId}, userId: ${result._doc.userId}, inventory: ${inventory}`
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
  // caching
  inventoryCache[`${guildId}-${userId}`] = result._doc.inventory;

  return result._doc.inventory;
};

module.exports.addItem = async (guildId, userId, itemToAdd) => {
  let item = itemToAdd.toString();
  let addItem = `inventory.${item}`;
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
          [addItem]: 1,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    // caching
    inventoryCache[`${guildId}-${userId}`] = result._doc.inventory;
    console.log('item Updated');
  } catch {
    logger.error(
      `Failed to add ${itemToAdd} to guildId: ${guildId}, userId: ${userId}`
    );
  }
};
