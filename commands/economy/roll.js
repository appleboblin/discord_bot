const mongo = require('../../util/mongo');
const logger = require('../../util/logger');
const roll = require('../../features/economy/rollBox');
const Type = require('../../asset/shop/shopItems.json');
module.exports = {
  commands: ['roll'],
  description: 'Roll Loot box',
  //minArgs: 0,
  maxArgs: 1,
  callback: (message, args) => {
    //set empty array
    let items = [];
    let weight = [];
    // check if matches
    if (args == 'normal') {
      // load values
      let boxType = Type.BoxType.normal;
      // get values of each item
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
    }
    // check if matches
    if (args == 'rare') {
      // load values
      let boxType = Type.BoxType.rare;
      // get values of each item
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
    }
    // check if matches
    if (args == 'epic') {
      // load values
      let boxType = Type.BoxType.epic;
      // get values of each item
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
    }
    message.channel.send(`Please choose either \`normal\` or \`rare\`.`);
  },
};
