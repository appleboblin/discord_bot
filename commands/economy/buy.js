const logger = require('../../util/logger');
const shopItems = require('../../asset/shop/shopItems.json');
const economy = require('../../features/economy/economy');
const inv = require('../../features/economy/inventory');
module.exports = {
  commands: 'buy',
  description: 'Buy Loot Box',
  expectedArgs: '<rarity>',
  minArgs: 1,
  maxArgs: 1,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, args) => {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const userTag = message.author.tag;
    const userName = message.author.username;
    const userNickname = message.member.nickname;

    let invalidBox = [];

    let result = 0;
    BoxList = Object.keys(shopItems.BoxType);
    BoxList.map((value) => {
      invalidBox.push(value);
      if (
        // check if its the box selected is in list
        value.toString().toLowerCase() == args.toString().toLowerCase()
      ) {
        // true
        result += 1;
      } else {
        // false
        result += 0;
      }
    });
    // check if BoxType is empty
    if (shopItems.BoxType.length === 0)
      return message.channel.send('No boxes available');
    let boxList = Object.keys(shopItems.BoxType);
    //check if box type matches any in json
    if (result == 1) {
      let bal = args.toString().toLowerCase();
      // check if user have enough balance
      const check = await economy.checkBalance(guildId, userId, bal);
      // if enough balance, buy
      if (check === 1) {
        // increase box count
        let addBox = bal.replace(/\b\w/g, (l) => l.toUpperCase());
        const totalBox = await economy.addBox(guildId, userId, addBox);
        // take away coins needed
        const pay = await economy.removeCoins(guildId, userId);

        // call inventory menu
        inv.chest(message);

        // if not enough balance, prompt the user
      } else if (check === 0) {
        message.channel.send(`You don't have enough Cock Coins!`);
        // error handling
      } else {
        logger.error('failed');
        message.send('Something went wrong');
      }
    } else {
      message.channel.send('Invalid box type!');
    }
  },
};
