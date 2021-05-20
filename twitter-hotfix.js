// requirements
const twdl = require('twdl');
const Discord = require('discord.js');
const client = new Discord.Client();
// require custom files
const { prefix } = require('./config.json');
const token = require('./token.json');
const { command } = require('./function/generalCommands');
const logger = require('./function/logger');

// arrays
let tweetUrls = [
  // Individual tweets
  //'https://twitter.com/BrgrArt/status/1393359826693103616',
];
let mediaUrls = [];

// const
const options = {
  downloadUrlFn: downloadUrl,
};
const dest = '835471079303544834';

// functions
const downloadUrl = async (mediaUrl, tweetUrl, mediaData, options) => {
  mediaUrls.push(mediaUrl);
  return mediaUrl;
};
const sendImage = async () => {
  let results = await twdl.downloadUrls(tweetUrls, options);
  imgUrl = mediaUrls.forEach((e) => {
    //Send when getting info
    client.channels.cache.get(dest).send(e);
    logger.info('New image sent to channel');
    let removeFirstInArray = mediaUrls.shift();
  });
  return;
};
const checkNewUrl = (client, triggerText) => {
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

// run when bot it online
client.on('ready', () => {
  checkNewUrl(client);
});

// Login Discord
client.login(token.discord_token);

//Set Status
client.once('ready', () => {
  logger.info(`twitter bot is up and running.`);
});
