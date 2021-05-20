// requirements
const fs = require('fs');
// Destructure prefix
const { prefix } = require('../config.json');
const { command } = require('./generalCommands');
// call logger
const logger = require('../util/logger');

// Fetch recent 100 messages
const fetchRecent = (client) => {
  command(client, 'fetch', (message) => {
    message.channel.messages.fetch({ limit: 100 }).then((messages) => {
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
      let dir = `./fetch/${year}-${month}-${date}-${hours}:${minutes}:${seconds}.json`;
      // Create empty array
      let discordMessage = [];
      // Add each message to array
      messages.forEach((message) => discordMessage.push(message.content));
      // Save array to file
      fs.writeFileSync(dir, JSON.stringify(discordMessage, null, 4));
      logger.info(`Saved messages to ${dir}`);
      // Send file to channel
      message.channel.send({
        files: [dir],
      });
      logger.info(
        `Reacted to '${prefix}fetch' in Server: ${message.guild.name}(${message.guild.id}), Channel: ${message.channel.name}(${message.channel.id})`
      );
    });
    return;
  });
};

// Polls
const polls = (client) => {
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
    // send logs
    function sendLog() {
      logger.info(
        `Reacted to '${prefix}poll' in Server: ${message.guild.name}(${message.guild.id}), Channel: ${message.channel.name}(${message.channel.id})`
      );
    }
    // Automatic react to message in certain channel.
    if (channelIds.includes(message.channel.id)) {
      addReactions(message);
      sendLog();
      // set command
    } else if (
      message.content.toLowerCase() === `${prefix}poll` &&
      message.channel.type === 'text'
    ) {
      // delete command
      await message.delete();
      // fetch recent 1 message
      const fetched = await message.channel.messages.fetch({ limit: 1 });
      // Confirm and react to message
      if (fetched && fetched.first()) {
        addReactions(fetched.first());
      }
      sendLog();
    }
  });
};

/* Welcome message when a user joins the server
Only works if bot is in one server, use welcomeSchema instead*/
const welcomeMessage = (client) => {
  // Hard coded
  const channelId = '727736634753155112'; // channel to send welcome message
  const targetChannelId = '723911584761774080'; // channel want to link to

  client.on('guildMemberAdd', (member) => {
    // set welcome message
    const message = `Hi <@${
      member.id
    }>, you are now a part of Cockers. Head to ${member.guild.channels.cache
      .get(targetChannelId)
      .toString()} for some hentai!`;
    // get channel id
    const channel = member.guild.channels.cache.get(channelId);
    // send message
    channel.send(message);
    logger.info(`${member.displayName}(${member.id}) joined the server`);
  });
};

/* Member count
Only if bot is in one server, haven't wrote a multi server equivalent*/
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
  // update when bot starts up
  //const guild = client.guilds.cache.get('464316540490088448')
  //updateMembers(guild)
}

// Temp message
const tempMessage = (channel, text, duration = -1) => {
  channel.send(text).then((message) => {
    if (duration === -1) {
      return;
    }
    setTimeout(() => {
      message.delete();
    }, 1000 * duration); // 1000=ms. 1000ms=1sec
  });
};

// animated emoji bypass
const animatedEmoji = (message) => {
  if (message.content.includes(`WEEEEE`) && message.channel.type === 'text') {
    message.delete();
    message.channel.send(`<a:WEEEEE:666919409675141121>`);
  } else if (
    message.content.includes(`BOOBA`) &&
    message.channel.type === 'text'
  ) {
    message.delete();
    message.channel.send(`<a:BOOBA:794297593621512192>`);
  } else if (
    message.content.includes(`Wala`) &&
    message.channel.type === 'text'
  ) {
    message.delete();
    message.channel.send(`<a:Wala:674486224937025546>`);
  } else if (
    message.content.includes(`TriFi`) &&
    message.channel.type === 'text'
  ) {
    message.delete();
    message.channel.send(`<a:TriFi:664225390360920096>`);
  } else if (
    message.content.includes(`wall`) &&
    message.channel.type === 'text'
  ) {
    message.delete();
    message.channel.send(`<a:wall:737025848023973951>`);
  } else if (
    message.content.includes(`boomerTUNE`) &&
    message.channel.type === 'text'
  ) {
    message.delete();
    message.channel.send(`<a:boomerTUNE:682763462568706205>`);
  }
};
// exporting modules
module.exports = {
  fetchRecent,
  polls,
  welcomeMessage,
  memberCount,
  tempMessage,
  animatedEmoji,
};
