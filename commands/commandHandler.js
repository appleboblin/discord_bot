const { prefix } = require('../config.json');

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ];

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission "${permission}"`);
    }
  }
};
const allCommands = {};

module.exports = (commandOptions) => {
  let { commands, permissions = [] } = commandOptions;
  // Make sure commands and aliases are in array
  if (typeof commands === 'string') {
    commands = [commands];
  }

  console.log(`Found command "${commands[0]}"`);
  // Check permissions are in array and valid

  if (permissions.length) {
    if (typeof permissions === 'string') {
      permission = [permission];
    }
    validatePermissions(permissions);
  }

  for (const command of commands) {
    allCommands[command] = {
      // object destructuring
      ...commandOptions,
      commands,
      permissions,
    }
  }
};

module.exports.listen = (client) => {
  // listen for messages
  client.on('message', (message) => {
    const { member, content, guild } = message;
    // Split on spaces
    const arguments = content.split(/[ ]+/); // Doesn't matter how many spaces user add
    // remove command, first index [0]
    const name = arguments.shift().toLowerCase();
    if (name.startsWith(prefix)) {
      const command = allCommands[name.replace(prefix, ``)];
      if (!command) {
        return;
      }
      const {
        permissions,
        permissionError = 'You do not have permission to run this command.',
        requiredRoles = [],
        minArgs = 0,
        maxArgs = null,
        expectedArgs,
        callback,
      } = command;
      // commands ran
      // check permission
      for (const permission of permissions) {
        if (!member.hasPermission(permission)) {
          message.reply(permissionError);
          return;
        }
      }

      // Check for required roles
      for (const requiredRole of requiredRoles) {
        const role = guild.roles.cache.find(
          (role) => role.name === requiredRole
        );

        if (!role || !member.roles.cache.has(role.id)) {
          message.reply(`You need "${requiredRole}" to use this command.`);
          return;
        }
      }

      // check amount of arguments
      if (
        arguments.length < minArgs ||
        (maxArgs !== null && arguments.length > maxArgs)
      ) {
        message.reply(`Invalid syntax. Use ${prefix}${alias} ${expectedArgs}`);
        return;
      }

      // handel custom commands
      callback(message, arguments, arguments.join(' '), client);
    }
  });
};
