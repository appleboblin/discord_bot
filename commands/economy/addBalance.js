
const economy = require('../../features/features/economy')
const logger = require('../../util/logger')

module.exports = {
  commands: ['addbalance', 'addbal', 'baladd','balanceadd'],
  minArgs: 2,
  description: "Adds balance",
  maxArgs: 2,
  expectedArgs: "<Target @> <coin amount>",
  permissionError: 'You must be an administrator to use this command.',
  permissions: 'ADMINISTRATOR',
  callback: async (message, arguments) => {
    const mention = message.mentions.users.first()

    if (!mention) {
      message.reply('Please tag a user to add coins to.')
      return
    }

    const coins = arguments[1]
    if (isNaN(coins)) {
      message.reply('Please provide a valid number of coins.')
      return
    }

    const guildId = message.guild.id
    const userId = mention.id
    const userName = mention.tag

    const newCoins = await economy.addCoins(guildId, userId, coins)

    message.channel.send(
      `${coins} coins given to <@${userId}>. They now have ${newCoins} coins!`
    )
    logger.info(`${coins} coins given to ${userName}(${userId}).`)
  },
}