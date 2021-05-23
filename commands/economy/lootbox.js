const mongo = require('../../util/mongo');
const logger = require('../../util/logger');
const roll = require('../../features/features/roll');
const Type = require('../../asset/shop/shopItems.json');
module.exports = {
  commands: ['roll'],
  description: 'Roll Loot box',
  //minArgs: 0,
  maxArgs: 1,
  callback: (message, argument) => {
    let items = [];
    let weight = [];
    if (argument == 'normal') {
      let boxType = Type.BoxType.normalBox;
      boxType.map((value, index) => {
        items.push(value.item);
        weight.push(Number(value.weight));
      });
      result = roll.rollBox(weight);
      return message.channel.send(`Item: ${items[result]}`);
    }
    if (argument == 'rare') {
      let boxType = Type.BoxType.rareBox;
      boxType.map((value, index) => {
        items.push(value.item);
        weight.push(Number(value.weight));
      });
      result = roll.rollBox(weight);
      return message.channel.send(`Item: ${items[result]}`);
    }
    message.channel.send(`Please choose either \`normal\` or \`rare\`.`);
  },
};
