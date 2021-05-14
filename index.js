// Requirements
const Discord = require('discord.js');
// Set Discord client
const client = new Discord.Client();
// require custom files
const config = require('./config.json');
const token = require('./token.json');
const command = require('./function/command');
const welcomeMessage = require('./function/welcome-message');
const privateMessage = require('./function/private-message');
const playMedia = require('./function/play-audio');
const logger = require('./function/logger');
const helpCommand = require('./function/help-command');

// Get prefix from config
const { prefix } = config;
// Active when Discord client is ready
client.on('ready', () => {
  // ready message
  console.log('client ready');
  // test message
  command(client, ['no', 'test'], (message) => {
    message.channel.send('.test');
    logger.info('test');
  });
  // Get info of servers the bot is in
  command(client, 'server', (message) => {
    client.guilds.cache.forEach((guild) => {
      message.channel.send(`${guild.name} gotz ${guild.memberCount} members`);
    });
  });
  //Clear recent messages of a channel
  command(client, ['cc', 'clearchannel'], (message) => {
    if (message.member.hasPermission('ADMINISTRATOR'))
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results);
      });
  });
  // Set new Status
  command(client, 'status', (message) => {
    const content = message.content.replace(`${prefix}status`, '');

    client.user.setPresence({
      status: 'available',
      activity: {
        name: content,
        type: 'LISTENING',
      },
    });
  });
  //Private Message
  privateMessage(client, 'Ding', 'dong');
  // Welcome message
  welcomeMessage(
    client,
    '842397223735525407',
    'Biggie poopie Jojo\nSecond Line\nThird Line :exploding_head:\n4 is not this ',
    [
      // emoji reactions
      '😇',
      '🙃',
      '💩',
      '🤯',
      '<:YEP:715965999450554429>',
    ]
  );
  // Set launch status
  client.user.setPresence({
    status: 'available',
    activity: {
      name: `${prefix}help for more information`,
      type: 'PLAYING',
    },
  });
  // help
  helpCommand(client, 'help', (message) => {});

  // Play Media
  playMedia(client, 'sound', (message) => {});

  // Kick bot from voice
  command(client, 'leave', (message) => {
    if (!message.guild.me.voice.channel) {
      logger.info('Bot not in voice channel');
      return message.channel.send('Not in voice channel'); // If the bot is not in a voice channel, then return a message
    }
    message.guild.me.voice.channel.leave(); //Leave voice channel
    logger.info('Booted bot from voice channel.');
    return;
  });
});

// Login Discord
client.login(token.discord_token);
