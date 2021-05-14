// call logger
const logger = require('./logger');

// Destructure prefix
const { prefix } = require('../config.json');

// Handle command messages
module.exports = (client, aliases, callback) => {
  client.on('message', (message) => {
    // Ignore if bot says it
    if (message.author.bot) return;
    let guildname = message.guild.name;
    let guildid = message.guild.id;
    let channelname = message.channel.name;
    let channelid = message.channel.id;
    message.channel.send({
      embed: {
        color: 15277667,
        author: {
          name: 'Ding Ding',
          icon_url:
            'https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp',
        },
        title: 'Stupid Commands I Got So Far.',
        url: 'https://youtu.be/dQw4w9WgXcQ',
        description: "Don't click it.",
        fields: [
          {
            name: `${prefix}help`,
            value: 'This embed message',
          },
          {
            name: `${prefix}stupid`,
            value: 'Prints out `You Stupid.`',
          },
          {
            name: `${prefix}jono`,
            value: 'Prints out `username, Jono agrees that you are stupid`',
          },
          {
            name: `${prefix}nick`,
            value: 'Prints out `nickname, Jono agrees that you are stupid`',
          },
          {
            name: 'horse girl',
            value:
              'Any message that contains `horse girl`, bot will react 🐴 👧',
          },
          {
            name: `${prefix}url`,
            value: 'Return your avatarURL',
          },
          {
            name: `${prefix}fetch`,
            value:
              'Fetch 100 most recent messages from the channel and send as `.json`',
          },
          {
            name: `${prefix}play \`YouTube URL\``,
            value: 'Play YouTube audio',
          },
          {
            name: `${prefix}skip`,
            value: 'Skip queue',
          },
          {
            name: `${prefix}stop`,
            value: 'Stop audio',
          },
          {
            name: `${prefix}sound \`arguments\``,
            value: `\`${prefix}sound list\` for audio list. \`${prefix}sound filename\` to play audio, don't need \`.mp3\``,
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url:
            'https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp',
          text: 'Jobo the Bot',
        },
      },
    });
    logger.info(
      `Send '${prefix}help' to Server: ` +
        guildname +
        '(' +
        guildid +
        ')' +
        ', Channel: ' +
        channelname +
        '(' +
        channelid +
        ')'
    );
    return;
  });
};
