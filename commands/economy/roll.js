const mongo = require('../../util/mongo');
const logger = require('../../util/logger');
const roll = require('../../features/economy/rollBox');
const Type = require('../../asset/shop/shopItems.json');
module.exports = {
  commands: ['roll'],
  description: 'Roll Loot box',
  //minArgs: 0,
  maxArgs: 1,
  callback: (message, chosenBox) => {
    //set empty array
    let items = [];
    let weight = [];
    let result = 0;
    BoxList = Object.keys(Type.BoxType);
    BoxList.map((value) => {
      invalidBox = [];
      invalidBox.push(value);

      if (
        // check if its the box selected is in list
        value.toLowerCase().includes(chosenBox)
      ) {
        // true
        result += 1;
      } else {
        // false
        result += 0;
      }
    });
    console.log(result);
    // if enough box match
    if (result == 1) {
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
      // if not enough balance, prompt the user
    } else if (result == 0) {
      let warning = invalidBox.toString();
      message.channel.send(`Please choose from ${warning}`);
      // error handling
    } else {
      logger.error('failed');
      message.channel.send('Something went wrong');
    }
  },
};
