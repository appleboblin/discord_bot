// call logger
const logger = require('./logger');

// Destructure prefix
const { prefix } = require('../config.json');

// exporting modules
module.exports = {
  // command handler
  command: (client, aliases, callback) => {
    // make things into array
    if (typeof aliases === 'string') {
      aliases = [aliases];
    }

    client.on('message', (message) => {
      // Ignore if bot says it
      if (message.author.bot) return;
      //get content of message
      const { content } = message;
      // Look for messages that have prefix and command
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`;
        // if theres a command, log it and callback
        if (content.startsWith(`${command} `) || content === command) {
          logger.info(`Running ${command}`);
          // pass message so callback have access to channel, content, anything it needs
          callback(message);
        }
      });
    });
  },

  // Welcome message
  welcomeMessage: async (client, id, text, reactions = []) => {
    const channel = await client.channels.fetch(id);
    const addReactions = (message, reactions) => {
      //remove 0 index
      message.react(reactions[0]);
      //move everything to the left
      reactions.shift();
      // If array is empty
      if (reactions.length > 0) {
        // Set delay, so reactions are in order
        setTimeout(() => addReactions(message, reactions), 500);
      }
    };
    channel.messages.fetch().then((messages) => {
      // Check if theres already a message
      if (messages.size === 0) {
        // Send new message
        channel.send(text).then((message) => {
          addReactions(message, reactions);
        });
      } else {
        // Edit message
        for (const message of messages) {
          // Change text
          message[1].edit(text);
          // Change reactions
          addReactions(message[1], reactions);
          logger.info('Set welcome message and reactions');
        }
      }
    });
  },

  // reactPhrase
  reactPhrase: (client, triggerText) => {
    client.on('message', (message) => {
      if (
        //check where it receive the message from
        message.channel.type === 'text' &&
        message.content.includes(triggerText)
      ) {
        // action
        message.react('🐴');
        message.react('👧');
        logger.info('Reacted to ' + triggerText);
      }
    });
  },

  // Private message
  privateMessage: (client, triggerText, replyText) => {
    client.on('message', (message) => {
      if (
        //check where it receive the message from
        message.channel.type === 'text' &&
        message.content.toLowerCase() === triggerText.toLowerCase()
      ) {
        //send text
        message.author.send(replyText);
        logger.info(
          `Sent Private Message to ` +
            message.author.username +
            '(' +
            message.author.id +
            ')'
        );
      }
    });
  },

  // Help command
  helpCommand: (client, aliases, callback) => {
    // make things into array
    if (typeof aliases === 'string') {
      aliases = [aliases];
    }

    client.on('message', (message) => {
      // Ignore if bot says it
      if (message.author.bot) return;
      //get content of message
      const { content } = message;
      // Look for messages that have prefix and command
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`;
        // if theres a command, log it and callback
        if (content.startsWith(`${command} `) || content === command) {
          logger.info(`Running the command ${command}`);
          // pass message so callback have access to channel, content, anything it needs
          let guildName = message.guild.name;
          let guildId = message.guild.id;
          let channelName = message.channel.name;
          let channelId = message.channel.id;
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
                  value:
                    'Prints out `username, Jono agrees that you are stupid`',
                },
                {
                  name: `${prefix}nick`,
                  value:
                    'Prints out `nickname, Jono agrees that you are stupid`',
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
                  name: `${prefix}play \`Music URL\``,
                  value: 'Play music',
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
                  name: `${prefix}media \`arguments\``,
                  value: `\`${prefix}media list\` for media list. \`${prefix}media filename\` to play media, include file extension.`,
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
              guildName +
              '(' +
              guildId +
              ')' +
              ', Channel: ' +
              channelName +
              '(' +
              channelId +
              ')'
          );
          return;
        }
      });
    });
  },
};