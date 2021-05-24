module.exports = {
  commands: ['play'],
  description: 'Play Music',
  expectedArgs: '<url>',
  minArgs: 1,
  maxArgs: 1,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: (message, args, text) => {
    return;
  },
};
