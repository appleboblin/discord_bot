const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix } = require('./config.json');
const token = require('./token.json');
const logger = require('./function/logger');

client.on('ready', async () => {
  console.log('The client is ready!');

  const baseFile = 'commandHandler.js';
  const commandBase = require(`./commands/${baseFile}`);
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
      } else if (file !== baseFile) {
        // import file
        const option = require(path.join(__dirname, dir, file));
        commandBase(option);
      }
    }
  };

  readCommands('commands');

  commandBase.listen(client);
});

//Login Discord
client.login(token.discord_token);

//Set Status
client.once('ready', () => {
  logger.info(`${client.user.tag} is up and running.`);

  // Set launch status
  client.user.setPresence({
    status: 'available',
    activity: {
      name: `${prefix}help || New command handler`,
      type: 'PLAYING',
    },
  });
});

client.once('reconnecting', () => {
  logger.info(`${client.user.tag} is reconnecting.`);
});

client.once('disconnect', () => {
  logger.info(`${client.user.tag} is disconnected.`);
});

client.once('error', (err) => {
  logger.error('Discord client error:', err);
  client.quit();
  reject(err);
});
