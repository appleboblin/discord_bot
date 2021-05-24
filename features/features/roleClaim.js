const logger = require('../../util/logger');
const firstMessage = require('../../util/firstMessage');
//modules.export
module.exports = async (client) => {
  // Set role channel
  const channelId = '843147115584684073';

  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName);
  // configure emoji and role
  const emojis = {
    YEP: 'incel',
    Wala: 'weeb+',
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
  // Using firstMessage function
  await firstMessage(client, channelId, emojiText, reactions);
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
      logger.info(`Added ${roleName} role to ${user.tag}(${user.id})`);
    } else {
      member.roles.remove(role);
      logger.info(`Removed ${roleName} role from ${user.tag}(${user.id})`);
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
};
