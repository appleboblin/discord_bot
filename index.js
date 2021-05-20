// Requirements
const Discord = require('discord.js');

// Set Discord client
const client = new Discord.Client();
// require custom files
const { prefix } = require('./config.json');
const token = require('./token.json');
const {
  command,
  firstMessage,
  privateMessage,
  helpCommand,
  reactPhrase,
  roleClaim,
} = require('./function/generalCommands');
const { playMedia, playMusic } = require('./function/mediaPlayer');
const logger = require('./function/logger');
const {
  fetchRecent,
  polls,
  //welcomeMessage,
  //memberCount,
  //tempMessage,
  animatedEmoji,
} = require('./features/features/coolCommands');
const mongo = require('./function/mongo');
const {
  welcome,
  messageCounter,
  mute,
} = require('./function/generalCommandsDatabase');

// increase event limit
require('events').EventEmitter.defaultMaxListeners = 20;

// Active when Discord client is ready
client.on('ready', () => {
  // Bypass animated emoji nitro
  command(
    client,
    ['WEEEEE', 'BOOBA', 'Wala', 'TriFi', 'wall', 'boomerTUNE'],
    (message) => {
      animatedEmoji(message);
    }
  );
  // Set bot name
  client.user.setUsername('JoBot_mini');
  logger.info('Bot Name set');

  // Commands
  // test message
  command(client, [':BOOBA:'], (message) => {
    message.delete();
    message.channel.send(`<a:BOOBA:794297593621512192>`);
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
        `${message.author.tag}(${message.author.id}) don't have permission`
      );
    }
  });
  // Set bot status
  command(client, 'status', (message) => {
    const content = message.content.replace(`${prefix}status `, '');

    client.user.setPresence({
      status: 'available',
      activity: {
        name: content,
        type: 'LISTENING',
      },
    });
  });

  //Private Message
  privateMessage(client, 'La', 'Ma');

  // React to phrase
  reactPhrase(client, 'pew pew');

  // First message
  firstMessage(
    client,
    '842369951826575360',
    'Biggie poopie Jojo\nThis is a message board\nWhat am i doing.... :exploding_head:\nHello Jonai\nNeed to work on message reactions next.\nThis is another new line',
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
  helpCommand(client);

  // Play Local Media
  playMedia(client);

  // Fetch recent message
  fetchRecent(client);

  // Play Music
  playMusic(client);

  // stupid
  command(client, 'stupid', (message) => {
    message.channel.send('You stupid.');
  });

  // jono
  command(client, 'jono', (message) => {
    message.channel.send(
      `${message.author.username} , Jono agrees that you are stupid`
    );
  });

  // nick
  command(client, 'nick', (message) => {
    message.channel.send(
      `${message.member.displayName} , Jono agrees that you are stupid`
    );
  });

  // url
  command(client, 'url', (message) => {
    message.channel.send(message.author.displayAvatarURL('jpg'));
  });

  // server info
  command(client, 'serverinfo', (message) => {
    message.channel.send(
      `Server ${message.guild.name}(${message.guild.id}), Channel: <#${message.channel.id}>(${message.channel.id})`
    );
  });

  // Reaction roles
  roleClaim(client);

  // Polls
  polls(client);

  // Welcome message when new user joins
  //welcomeMessage(client);

  // member count
  //memberCount(client);

  /*// temp message
  const guild = client.guilds.cache.get('214357162355326977'); // Target server
  const channel = guild.channels.cache.get('727736634753155112'); // Target channel
  command(client, 'tester', (message) => {
    tempMessage(channel, 'Ring ring ling dong', 3);
  });*/
});

// MongoDB commands
client.on('ready', async () => {
  console.log('Attempting to connect to mongo');
  welcome(client);
  messageCounter(client);
  mute(client);
});

// Login Discord
client.login(token.discord_token);

//Set Status
client.once('ready', () => {
  logger.info(`${client.user.tag} is up and running.`);

  // Set launch status
  client.user.setPresence({
    status: 'available',
    activity: {
      name: `${prefix}help || xp-system working in progress`,
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
