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
        console.log(`Running the command ${command}`);
        // pass message so callback have access to channel, content, anything it needs
        callback(message);
      }
    });
  });
};
