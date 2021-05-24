const mongo = require('../../util/mongo');
const economy = require('./economy');
const logger = require('../../util/logger');

module.exports = (client) => {};

module.exports.inventory = async (guildId, userId, boxToCheck) => {
  const result = await economy.getBox(guildId, userId, boxToCheck);

  // make string look presentable
  let total = JSON.stringify(result);
  // using regular expression
  let inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');
  return inventory;
};
