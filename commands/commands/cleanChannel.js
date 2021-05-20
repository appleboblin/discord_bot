const logger = require('../../util/logger');
module.exports = {
  commands: ['cleanchannel', 'cc'],
  expectedArgs: '.cc',
  description: 'Delete recent 50 messages',
  permissionError: 'You need administrator permission to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: (message) => {
    // Set delete size in fetch(). 100 is maximum, default is 50 eg. fetch({ limit: 100 })
    message.channel.messages.fetch().then((results) => {
      message.channel.bulkDelete(results);
      logger.info(`Deleted ${results.size} messages`);
    });
  },
  permissions: ['ADMINISTRATOR'],
  //requiredRoles: [`test`],
};
