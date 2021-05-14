// call logger
const logger = require('./logger');

module.exports = (client, triggerText, replyText) => {
  client.on('message', (message) => {
    if (
      //check where it receive the message from
      message.channel.type === 'text' &&
      message.content.toLowerCase() === triggerText.toLowerCase()
    ) {
      //send text
      message.author.send(replyText);
      logger.info(
        `Sent Private Message to ` +
          message.author.username +
          '(' +
          message.author.id +
          ')'
      );
    }
  });
};