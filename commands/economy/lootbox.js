const mongo = require('../../util/mongo');
const logger = require('../../util/logger');
const rollBox = require('../../features/features/roll');

module.exports = {
  commands: ['roll'],
  description: 'Roll Loot box',
  //minArgs: 0,
  //maxArgs: 0,
  callback: (message) => {
    let boxType = Type.BoxType.normalBox;
    let items = [];
    let weight = [];

    boxType.map((value, index) => {
      items.push(value.item);
      weight.push(Number(value.weight));
    });

    console.log('Item: ' + items[rollBox(weight)]);
  },
};