const mongo = require('../../util/mongo');
const logger = require('../../util/logger');
const roll = require('../../features/economy/rollBox');
const Type = require('../../asset/shop/shopItems.json');
const economy = require('../../features/economy/economy');
module.exports = {
  commands: ['roll'],
  description: 'Roll Loot Box',
  expectedArgs: '<box>',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, chosenBox) => {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const userTag = message.author.tag;
    const userName = message.author.username;
    const userNickname = message.member.nickname;
    //set empty array
    let items = [];
    let weight = [];
    let invalidBox = [];
    let result = 0;
    let boxCount = 0;
    let allLower = chosenBox.toString().toLowerCase();
    let type =
      // Convert first character to capital
      allLower
        .toString()
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
    BoxList = Object.keys(Type.BoxType);
    BoxList.map((value) => {
      invalidBox.push(value);
      if (
        // check if its the box selected is in list
        value.toString().toLowerCase() == chosenBox.toString().toLowerCase()
      ) {
        // true
        result += 1;
      } else {
        // false
        result += 0;
      }
    });

    let check = await economy.getBox(guildId, userId);
    //console.log(check);
    //console.log(type);
    //console.log(Type.BoxType[allLower]);
    //console.log(check[type]);

    if (result == 1) {
      if (check[type] - 1 >= 0) {
        let buy = await economy.removeBox(guildId, userId, chosenBox);
        // if enough box match
        let boxType = Type.BoxType[allLower];
        //console.log(boxType);
        // get name each of boxes
        boxType.map((value, index) => {
          // push into empty array
          items.push(value.item);
          weight.push(Number(value.weight));
        });
        // get selected item
        result = roll.rollBox(weight);
        // send item message
        itemsResult = items[result];
        trimmed = itemsResult.replace(/([A-Z])/g, ' $1').trim();
        return message.channel.send(`Item: ${trimmed}`);
        // if not enough balance, prompt the user
      } else {
        let display = chosenBox
          .toString()
          .toLowerCase()
          .replace(/[,]/g, '\n')
          .replace(/[:]/g, ': ');
        message.channel.send(
          `Sorry ${userNickname}, you don't have enough ${display}. Please purchase more before rolling! `
        );
      }
    } else if (result == 0) {
      let warning = invalidBox.toString();
      warning = warning.replace(/[,]/g, ', ');
      message.channel.send(`Please choose from ${warning}.`);
      // error handling
    } else {
      logger.error('failed');
      message.channel.send('Something went wrong');
    }
  },
};
