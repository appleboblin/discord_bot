// allows relative path
require('module-alias/register');

// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();

// requirements
const { prefix } = require('./config.json');
const token = require('./token.json');
const logger = require('./util/logger');
const loadCommands = require('./commands/loadCommands');
const loadFeatures = require('./features/loadFeatures');

// commands
client.on('ready', async () => {
  console.log('The client is ready!');
  loadCommands(client);
  loadFeatures(client);
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
      name: `${prefix}help for more info`,
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
