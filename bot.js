// allows relative path
require('module-alias/register');

// Discord client
const Discord = require('discord.js');
const client = new Discord.Client();

// requirements
//const { prefix, discord_token } = require('./config.json');
const { prefix } = require('./config.json');
const token = require('./token.json');
const logger = require('./util/logger');
const loadCommands = require('./commands/loadCommands');
const loadFeatures = require('./features/loadFeatures');
const mongo = require('./util/mongo');
const { playMusic } = require('./util/mediaPlayer');
const twt = require('./util/twitter-hotfix.js');
// commands
client.on('ready', async () => {
  logger.info('Loading...');
  // wait for mongo DB connection
  await mongo();
  // Load commands and features
  await loadCommands(client);
  await loadFeatures(client);
  playMusic(client);
  //twt.checkNewUrl(client);
  logger.info('Done Loading!');
});

//Login Discord
client.login(token.discord_token);
//client.login(discord_token);
//Set Status
client.once('ready', () => {
  logger.info(`${client.user.tag} is starting up...`);

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
