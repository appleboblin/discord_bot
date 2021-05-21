const economy = require('../../features/features/economy');
const logger = require('../../util/logger');

module.exports = {
  commands: ['balance', 'bal'],
  maxArgs: 1,
  description: 'Balance check',
  expectedArgs: '[Target @]',
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author;
    const targetId = target.id;

    const guildId = message.guild.id;
    const userId = target.id;
    const userName = target.username;

    const coins = await economy.getCoins(guildId, userId);

    message.channel.send(`${userName} has \`${coins}\` cock coins!`);
  },
};
