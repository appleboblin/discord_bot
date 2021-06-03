const logger = require('../../util/logger');
const page = require('../../features/features/pageFlip');
module.exports = {
  commands: ['page'],
  description: 'Page testing',
  //expectedArgs: 'hi',
  //minArgs: 0,
  //maxArgs: 0,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, client) => {
    const id = message.author.id;
    //console.log(hi);
    page.pages(message, client);
  },
};
