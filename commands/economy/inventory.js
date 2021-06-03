const economy = require('../../features/economy/economy');
const check = require('../../features/economy/inventory');
const logger = require('../../util/logger');
module.exports = {
  commands: ['inventory', 'inv'],
  description: 'check inventory',
  expectedArgs: '',
  minArgs: 0,
  maxArgs: 0,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, args, text) => {
    check.inv(message);
  },
};
