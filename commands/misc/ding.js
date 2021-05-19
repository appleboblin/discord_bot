
module.exports = {
    commands: 'ding',
    description: "says dong when ding is detected",
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text) => {
      message.reply('Dong')
    },
  }