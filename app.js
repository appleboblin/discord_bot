// Initalize
require('dotenv').config();
const Discord = require('discord.js');
//const fetch = require("node-fetch");
//const https = require('https');
// Start Discord.js
const client = new Discord.Client();

// Bot login
client.login(process.env.BOT_TOKEN)
/*
// Adding Twitter forward function
const Twit = require('twit');
const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET_TOKEN,
  bearer_token: process.env.BEARER_TOKEN,
  timeout_ms: 60 * 1000,
});

// Destination channel Twitter forwards
const dest = '835471079303544834';

// Create a stream to follow tweets
const stream = T.stream('statuses/filter', {
  follow: '1179802346643021825', // @applenugget285
});

// Authorization to get json
const options = {
    headers: {
      'Authorization' : 'Bearer ' + process.env.BEARER_TOKEN
    }
};


// Get live Tweet
var imgUrl = '';
let url = '';
stream.on('tweet', (tweet) => {
    // api url format
    let url  = `https://api.twitter.com/2/tweets?ids=${tweet.id_str}&expansions=attachments.media_keys&media.fields=duration_ms,height,media_key,preview_image_url,public_metrics,type,url,width`;
    // processing json
    function setimgUrl(){
        https.get(url,options, (res) => {
            let body = "";
    
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                // do something with JSON
                    imgUrl = json['includes']['media'].forEach(e => {
                         //Send when getting info
                         client.channels.cache.get(dest).send(e['url']);
                    })
                } catch (error) {
                console.error(error.message);
                };
            });
        });
    
    };
    setTimeout(function(){
        setimgUrl();
        return;
    }, 5000);
});
*/
// Commands
const prefix = './';
client.on('message', function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if ( command === 'stupid') {
        message.channel.send('You stupid.'
      );
    }

    if ( command === 'jono') {
        message.channel.send(message.author.username + ', Jono agrees that you are stupid'
      );
    }

    if ( command === 'nick') {
        message.channel.send(message.member.displayName + ', Jono agrees that you are stupid'
      );
    }
});

client.on('message', (msg) => {
    if (msg.content === 'horse girl') {
      msg.react('🐴');
      msg.react('👧');
    }
});    
//Set Status
client.once('ready', () => {
    console.log(`${client.user.username} is up and running!`);

    client.user.setPresence({
        status: 'available',
        activity: {
            name: 'Twitter why you limit my api access',
            type: 'PLAYING',
        }
    });
});