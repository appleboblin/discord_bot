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
const reactPhrase = require('./function/react-phrase');

// increase the limit
require('events').EventEmitter.defaultMaxListeners = 15;

// Get prefix from config
const { prefix } = config;
// Active when Discord client is ready
client.on('ready', () => {
  // Set bot name
  client.user.setUsername('JoBot_Mini');
  logger.info('Bot Name set');

  // Commands
  // test message
  command(client, ['no', 'test'], (message) => {
    message.channel.send('.test');
    logger.info('test');
  });

  // Get info of servers the bot is in
  command(client, 'server', (message) => {
    client.guilds.cache.forEach((guild) => {
      message.channel.send(`${guild.name} have ${guild.memberCount} members`);
    });
  });

  // Clear recent messages of a channel
  command(client, ['cc', 'clearchannel'], (message) => {
    // Check if user have permission
    if (message.member.hasPermission('ADMINISTRATOR')) {
      // Set delete size in fetch(). 100 is maximum, default is 50 eg. fetch({ limit: 100 })
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results);
        logger.info(`Deleted ${results.size} messages`);
      });
    } else {
      logger.info(
        message.author.username +
          '(' +
          message.author.id +
          ')' +
          ` don't have permission`
      );
    }
  });
  // Set bot status
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

  // React to phrase
  reactPhrase(client, 'pew pew');

  // Welcome message
  welcomeMessage(
    client,
    '842397223735525407',
    'Biggie poopie Jojo\nThis is a message board\nWhat am i doing.... :exploding_head:\nHello Jonai\nNeed to work on message reactions next.',
    [
      // emoji reactions
      '😇',
      '🙃',
      '💩',
      '🤯',
      '<:YEP:715965999450554429>',
    ]
  );

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

  // stupid
  command(client, 'stupid', (message) => {
    message.channel.send('You stupid.');
  });

  // jono
  command(client, 'jono', (message) => {
    message.channel.send(
      message.author.username + ', Jono agrees that you are stupid'
    );
  });

  // nick
  command(client, 'nick', (message) => {
    message.channel.send(
      message.member.displayName + ', Jono agrees that you are stupid'
    );
  });

  // url
  command(client, 'url', (message) => {
    message.channel.send(message.author.displayAvatarURL('jpg'));
  });

  // server info
  command(client, 'serverinfo', (message) => {
    message.channel.send(
      'Server: ' +
        message.guild.name +
        '(' +
        message.guild.id +
        '), Channel: <#' +
        message.channel.id +
        '>(' +
        message.channel.id +
        ')'
    );
  });
});

// Login Discord
client.login(token.discord_token);

//Set Status
client.once('ready', () => {
  logger.info(`${client.user.username} is up and running.`);

  // Set launch status
  client.user.setPresence({
    status: 'available',
    activity: {
      name: `${prefix}help for more information`,
      type: 'PLAYING',
    },
  });
});

client.once('reconnecting', () => {
  logger.info(`${client.user.username} is reconnecting.`);
});

client.once('disconnect', () => {
  logger.info(`${client.user.username} is disconnected.`);
});
