// call logger
const logger = require('./logger');
// requirements
const fs = require('fs');
// Destructure prefix
const { prefix } = require('../config.json');
// Handle command messages
module.exports = (client, aliases, callback) => {
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
};
