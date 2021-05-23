//requirements
const path = require('path');
const fs = require('fs');
const logger = require('../util/logger');

module.exports = (client) => {
  // get all file from the folder and automatically require, so don't need to do it manually
  const readFeatures = (dir) => {
    // return all file within directory
    const files = fs.readdirSync(path.join(__dirname, dir));
    // loop through all the file
    for (const file of files) {
      // check if directory or file
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      // recursive command until find all the files
      if (stat.isDirectory()) {
        readFeatures(path.join(dir, file));
      } else if (file !== 'loadFeatures.js') {
        // import file
        const feature = require(path.join(__dirname, dir, file));
        logger.info(`Enabling "${file}"`);
        feature(client);
      }
    }
  };
  logger.info('Loading Features');
  readFeatures('.');
};

// repo test