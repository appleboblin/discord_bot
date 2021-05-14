// call logger
const logger = require('./logger');

module.exports = (client, triggerText) => {
  client.on('message', (message) => {
    if (
      //check where it receive the message from
      message.channel.type === 'text' &&
      message.content.toLowerCase() === triggerText.toLowerCase()
    ) {
      // action
      message.react('🐴');
      message.react('👧');
      logger.info('Reacted to ' + triggerText);
    }
  });
};
