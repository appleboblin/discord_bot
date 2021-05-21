const logger = require('../../util/logger');
const { prefix } = require('../../config.json');
module.exports = {
  commands: ['poll'],
  expectedArgs: ' ',
  description: 'Poll message',
  permissionError: 'You need administrator permission to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message) => {
    // Automatic polls for channel
    const channelIds = [
      //'843484482732032020', //polls
    ];

    const addReactions = (message) => {
      // Set emote orders, need to use emote id for custom emotes
      message.react('298123460423581706');
      setTimeout(() => {
        message.react('794297593621512192');
      }, 500);
      setTimeout(() => {
        message.react('👌');
      }, 500);
    };

    // delete command
    await message.delete();
    // fetch recent 1 message
    const fetched = await message.channel.messages.fetch({ limit: 1 });
    // Confirm and react to message
    if (fetched && fetched.first()) {
      addReactions(fetched.first());
    }

    logger.info(
      `Reacted to '${prefix}poll' in Server: ${message.guild.name}(${message.guild.id}), Channel: ${message.channel.name}(${message.channel.id})`
    );
  },
  permissions: ['ADMINISTRATOR'],
  //requiredRoles: [`test`],
};
