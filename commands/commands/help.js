const loadCommands = require('../loadCommands');
const { prefix } = require('../../config.json');
const logger = require('../../util/logger');

module.exports = {
  commands: ['help', 'h'],
  description: 'Lists all commands',
  callback: (message) => {
    let reply = {
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
        fields: [],
        timestamp: new Date(),
        footer: {
          icon_url:
            'https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp',
          text: 'Jobo the Bot',
        },
      },
    };

    const commands = loadCommands();

    for (const command of commands) {
      // Check for permissions
      let permissions = command.permission;

      if (permissions) {
        let hasPermission = true;
        if (typeof permissions === 'string') {
          permissions = [permissions];
        }

        for (const permission of permissions) {
          if (!message.member.hasPermission(permission)) {
            hasPermission = false;
            break;
          }
        }

        if (!hasPermission) {
          continue;
        }
      }

      // Format the text
      const mainCommand =
        typeof command.commands === 'string'
          ? command.commands
          : command.commands[0];
      const args = command.expectedArgs ? ` ${command.expectedArgs}` : '';
      const { description } = command;
      reply.embed.fields.push({
        name: `${prefix}${mainCommand}${args}`,
        value: `${description}`,
      });
    }
    logger.info(`Send ${prefix}help`);
    return message.channel.send(reply);
  },
};
