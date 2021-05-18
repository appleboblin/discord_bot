const twdl = require('twdl');
const Discord = require('discord.js');
const { command } = require('./function/generalCommands');
const logger = require('./function/logger');

const client = new Discord.Client();
// require custom files
const config = require('./config.json');
const token = require('./token.json');

const { prefix } = config;

let tweetUrls = [
  /* … */
  //'https://twitter.com/BrgrArt/status/1393359826693103616',
];

let mediaUrls = [];

async function downloadUrl(mediaUrl, tweetUrl, mediaData, options) {
  mediaUrls.push(mediaUrl);
  return mediaUrl;
}

const options = {
  downloadUrlFn: downloadUrl,
};
const dest = '835471079303544834';

const nugget = async () => {
  var results = await twdl.downloadUrls(tweetUrls, options);
  imgUrl = mediaUrls.forEach((e) => {
    //Send when getting info
    client.channels.cache.get(dest).send(e);
    logger.info('New image sent to channel');
    var removeFirstInArray = mediaUrls.shift();
  });
  message.channel.send('hi');
  return;
};

function sendImage(client, triggerText) {
  client.on('message', (message) => {
    if (
      //check where it receive the message from
      message.channel.type === 'text' &&
      message.channel.id === '843726160324067389'
    ) {
      // action
      tweetUrls = [];
      tweetUrls.push(message.content);
      nugget();
      mediaUrls = [];
    }
  });
}

client.on('ready', () => {
  sendImage(client);
});
/*
client.on('message', (message) => {
  if (message.author.id === '199872338609569792') {
    nugget();
    return message.channel.send('stop');
  }
});*/

// Login Discord
client.login(token.discord_token);

//Set Status
client.once('ready', () => {
  logger.info(`twitter bot is up and running.`);
});
