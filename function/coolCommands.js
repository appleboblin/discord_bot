// call logger
const logger = require('./logger');
// requirements
const fs = require('fs');
// Destructure prefix
const { prefix } = require('../config.json');

// Fetch recent 100 messages
function fetchRecent(client, aliases, callback) {
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
        message.channel.messages.fetch({ limit: 100 }).then((messages) => {
          let guildName = message.guild.name;
          let guildId = message.guild.id;
          let channelName = message.channel.name;
          let channelId = message.channel.id;
          logger.info(`Received ${messages.size} messages`);
          // Get dates
          let date_ob = new Date();
          // Current date
          // Adjust 0 before single digit date
          let date = ('0' + date_ob.getDate()).slice(-2);
          // Current month
          let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
          // Current year
          let year = date_ob.getFullYear();
          // Current hours
          let hours = date_ob.getHours();
          // Current minutes
          let minutes = date_ob.getMinutes();
          // Current seconds
          let seconds = date_ob.getSeconds();
          // Set path and unique file name
          let dir =
            './fetch/' +
            year +
            '-' +
            month +
            '-' +
            date +
            '_' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds +
            '.json';
          // Create empty array
          let discordMessage = [];
          // Add each message to array
          messages.forEach((message) => discordMessage.push(message.content));
          // Save array to file
          fs.writeFileSync(dir, JSON.stringify(discordMessage, null, 4));
          logger.info(`Saved messages to ${dir} `);
          // Send file to channel
          message.channel.send({
            files: [dir],
          });
          logger.info(
            "Send './fetch' to Server: " +
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
        });
        return;
      }
    });
  });
}

// Polls
function polls(client, aliases, callback) {
  // Automatic polls for channel
  const channelIds = [
    '843484482732032020', //polls
  ];

  const addReactions = (message) => {
    // Set emote orders, need to use emote id for custom emotes
    message.react('298123460423581706');

    setTimeout(() => {
      message.react('794297593621512192');
    }, 500);
    setTimeout(() => {
      message.react('👌');
    }, 500);
  };

  client.on('message', async (message) => {
    let guildName = message.guild.name;
    let guildId = message.guild.id;
    let channelName = message.channel.name;
    let channelId = message.channel.id;
    //log
    function log() {
      logger.info(
        `Reacted to '${prefix}poll' in Server: ` +
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
    }
    // Automatic react to message in certain channel.
    if (channelIds.includes(message.channel.id)) {
      addReactions(message);
      log();
      // set command
    } else if (message.content.toLowerCase() === `${prefix}poll`) {
      // delete command
      await message.delete();
      // fetch recent 1 message
      const fetched = await message.channel.messages.fetch({ limit: 1 });
      // Confirm and react to message
      if (fetched && fetched.first()) {
        addReactions(fetched.first());
      }
      log();
    }
  });
}

// Welcome message when a user joins the server
// Only if bot is in one server
function welcomeMessage(client) {
  const channelId = '727736634753155112'; // channel to send welcome message
  const targetChannelId = '723911584761774080'; // channel want to link to

  client.on('guildMemberAdd', (member) => {
    // set welcome message
    const message = `Hi <@${
      member.id
    }>, you are now a part of Cockers. Head to ${member.guild.channels.cache
      .get(targetChannelId)
      .toString()} for some hentai!`;

    const channel = member.guild.channels.cache.get(channelId);
    // send message
    channel.send(message);
    logger.info(`${member.displayName}(${member.id}) joined the server`);
  });
}

// Member count
// Only if bot is in one server
function memberCount(client) {
  const channelId = '843517768561328139';

  const updateMembers = (guild) => {
    const channel = guild.channels.cache.get(channelId);
    channel.setName(`Members: ${guild.memberCount.toLocaleString()}`);
  };

  client.on('guildMemberAdd', (member) => {
    updateMembers(member.guild);
    logger.info('User joined. Updated member count.');
  });
  client.on('guildMemberRemove', (member) => {
    updateMembers(member.guild);
    logger.info('User left. Updated member count.');
  });
  // Only if bot is in one server
  //const guild = client.guilds.cache.get('464316540490088448')
  //updateMembers(guild)
}

// Temp message
function tempMessage(channel, text, duration = -1) {
  channel.send(text).then((message) => {
    if (duration === -1) {
      return;
    }

    setTimeout(() => {
      message.delete();
    }, 1000 * duration);
  });
}

// exporting modules
module.exports = {
  fetchRecent,
  polls,
  welcomeMessage,
  memberCount,
  tempMessage,
};
