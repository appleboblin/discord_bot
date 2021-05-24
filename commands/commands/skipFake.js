module.exports = {
  commands: ['skip'],
  description: 'Skip music',
  expectedArgs: '',
  minArgs: 0,
  maxArgs: 0,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: (message, args, text) => {
    return;
  },
};
