// call logger
const logger = require('./logger');

// Destructure prefix
const { prefix } = require('../config.json');

function reactPhrase(client, triggerText) {
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
}

function command(client, aliases, callback) {
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
}

// help Command
function helpCommand(client, aliases, callback) {
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
}

// Welcome Message
async function welcomeMessage(client, id, text, reactions = []) {
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
}

// Private message
function privateMessage(client, triggerText, replyText) {
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
}

// Reaction roles
function roleClaim(client) {
  // Set role channel
  const channelId = '843147115584684073';

  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName);
  // configure emoji and role
  const emojis = {
    BOOBA: 'incel',
    jynSuh: 'weeb+',
  };

  const reactions = [];
  // Set text
  let emojiText = 'Choose a level:\n\n';

  for (const key in emojis) {
    const emoji = getEmoji(key);
    // add reactions
    reactions.push(emoji);
    // send emoji and roles
    const role = emojis[key];
    emojiText += `${emoji} = ${role}\n`;
  }
  // Using welcomeMessage function
  welcomeMessage(client, channelId, emojiText, reactions);
  logger.info('Set reaction roles');
  // Handel reactions to add roles
  const handleReaction = (reaction, user, add) => {
    // Not adding role to itself
    if (user.id === client.user.id) {
      return;
    }

    const emoji = reaction._emoji.name;

    const { guild } = reaction.message;

    const roleName = emojis[emoji];
    if (!roleName) {
      return;
    }

    const role = guild.roles.cache.find((role) => role.name === roleName);
    const member = guild.members.cache.find((member) => member.id === user.id);

    if (add) {
      member.roles.add(role);
      logger.info(`Added ${roleName} role to ${user.username}(${user.id})`);
    } else {
      member.roles.remove(role);
      logger.info(`Removed ${roleName} role to ${user.username}(${user.id})`);
    }
  };

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, true);
    }
  });

  client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, false);
    }
  });
}

// exporting modules
module.exports = {
  // command handler
  command,

  // Welcome message
  welcomeMessage,

  // reactPhrase
  reactPhrase,

  // Private message
  privateMessage,

  // Reaction roles
  roleClaim,

  // Help command
  helpCommand,
};
