// requirements
const twdl = require('twdl');
const Discord = require('discord.js');
const client = new Discord.Client();
// require custom files

const logger = require('./logger');

module.exports = (client) => {};
const checkNewUrl = (client) => {
  // arrays
  let tweetUrls = [
    // Individual tweets
    //'https://twitter.com/BrgrArt/status/1393359826693103616',
  ];
  let mediaUrls = [];
  const dest = '723911584761774080';
  const sendImage = async () => {
    const downloadUrl = async (mediaUrl, tweetUrl, mediaData, options) => {
      mediaUrls.push(mediaUrl);
      return mediaUrl;
    };
    const options = {
      downloadUrlFn: downloadUrl,
    };
    let results = await twdl.downloadUrls(tweetUrls, options);
    imgUrl = mediaUrls.forEach((e) => {
      //Send when getting info
      client.channels.cache.get(dest).send(e);
      logger.info('New image sent to channel');
      let removeFirstInArray = mediaUrls.shift();
    });
    return;
  };
  client.on('message', (message) => {
    if (
      //check where it receive the message from
      message.channel.type === 'text' &&
      message.channel.id === '843726160324067389'
    ) {
      // action
      tweetUrls = [];
      tweetUrls.push(message.content);
      sendImage();
      mediaUrls = [];
    }
  });
};

module.exports = {
  checkNewUrl,
};
