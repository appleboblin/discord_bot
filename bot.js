const Discord = require('discord.js');
const client = new Discord.Client();

const { prefix } = require('./config.json');
const token = require('./token.json');
const logger = require('./function/logger');
const loadCommands = require('./commands/loadCommands');

client.on('ready', async () => {
  console.log('The client is ready!');

  loadCommands(client);
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
