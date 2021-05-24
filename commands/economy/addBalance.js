const economy = require('../../features/economy/economy');
const logger = require('../../util/logger');

module.exports = {
  commands: ['addbalance', 'addbal', 'baladd', 'balanceadd'],
  minArgs: 2,
  description: 'Adds balance',
  maxArgs: 2,
  expectedArgs: '<Target @> <coin amount>',
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, args) => {
    const mention = message.mentions.users.first();

    if (!mention) {
      message.reply('Please tag a user to add coins to.');
      return;
    }

    const coins = args[1];
    if (isNaN(coins)) {
      message.reply('Please provide a valid number of cock coins.');
      return;
    }

    const guildId = message.guild.id;
    const userId = mention.id;
    const userTag = mention.tag;
    const userName = message.mentions.members.first().nickname;

    const newCoins = await economy.addCoins(guildId, userId, coins);

    message.channel.send(
      `${coins} coins given to ${userName}. They now have \`${newCoins}\` cock coins!`
    );
    logger.info(`\`${coins}\` cock coins given to ${userTag}(${userId}).`);
  },
};
