const path = require('path');
const fs = require('fs');
const logger = require('../util/logger');
module.exports = (client) => {
  const baseFile = 'commandHandler.js';
  const commandBase = require(`./${baseFile}`);

  const commands = [];
  // get all file from the folder and automatically require, so don't need to do it manually
  const readCommands = (dir) => {
    // return all file within directory
    const files = fs.readdirSync(path.join(__dirname, dir));
    // loop through all the file
    for (const file of files) {
      // check if directory or file
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      // recursive command until find all the files
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile && file !== 'loadCommands.js') {
        // import file
        const option = require(path.join(__dirname, dir, file));
        commands.push(option);
        if (client) {
          commandBase(option);
        }
      }
    }
  };
  logger.info('Loading Commands');
  readCommands('.');
  if (client) {
    commandBase.listen(client);
  }
  return commands;
};
