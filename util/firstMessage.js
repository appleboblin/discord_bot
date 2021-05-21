const logger = require('./logger');
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

module.exports = async (client, id, text, reactions = []) => {
  const channel = await client.channels.fetch(id);
  // Check if channel is still there
  if (!channel) {
    console.log('Unknown channel ' + id);
    return;
  }

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
        logger.info('Set message and reactions');
      }
    }
  });
};
