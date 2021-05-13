module.exports = (client, triggerText, replyText) => {
  client.on('message', (message) => {
    if (
      //check where it recieve the message from
      message.channel.type === 'text' &&
      message.content.toLowerCase() === triggerText.toLowerCase()
    ) {
      //send text
      message.author.send(replyText);
    }
  });
};
