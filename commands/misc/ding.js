module.exports = {
    commands: 'ding',
    description: "says dong when ding is detected",
    //expectedArgs: 'hi',
    //minArgs: 0,
    //maxArgs: 0,
    //requiredRoles: [`test`],
    //permissions: ['SEND_MESSAGES'],
    //permissionError = 'You do not have permission to run this command.',
    callback: (message, arguments, text) => {
      message.reply('Dong')
    },
  }