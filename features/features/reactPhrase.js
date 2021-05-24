const logger = require('../../util/logger');
const trigger = require('../../config.json');

module.exports = (client) => {};

module.exports = (client) => {
  client.on('message', (message) => {
    if (
      //check where it receive the message from
      message.channel.type === 'text' &&
      message.content.includes(trigger.triggerText)
    ) {
      // action
      message.react('🐴');
      message.react('👧');
      logger.info(`Reacted to ${trigger.triggerText}`);
    }
  });
};
