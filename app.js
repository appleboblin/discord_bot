// Initalize
require('dotenv').config();
const Discord = require('discord.js');
const fetch = require("node-fetch");
const https = require('https');
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
const dest = '723911584761774080';

// Create a stream to follow tweets
const stream = T.stream('statuses/filter', {
  follow: '1382194772023123969', // @applenugget285
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
                         console.log("update")
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
    }, 120000);
});
*/
// Commands
// Set prefix
const prefix = './';
client.on('message', function(message) {
    // Check if bot sends the message. 
    if (message.author.bot) return;
    // Looks for message starting with prefix
    if (!message.content.startsWith(prefix)) return;
    // Remove prefix
    const commandBody = message.content.slice(prefix.length);
    // split into arrays of strings when there is space
    const args = commandBody.split(' ');
    // Make it lower case and assign to 'command'
    const command = args.shift().toLowerCase();

    if ( command === 'stupid') {
        message.channel.send('You stupid.');
    }

    if ( command === 'jono') {
        message.channel.send(message.author.username + ', Jono agrees that you are stupid');
    }

    if ( command === 'nick') {
        message.channel.send(message.member.displayName + ', Jono agrees that you are stupid');
    }

    if ( command === 'url') {
        message.channel.send(message.author.displayAvatarURL("jpg"));
    }

    if ( command === 'help') {
        message.channel.send({embed: {
            color: 15277667,
            author: {
              name: "Ding Ding",
              icon_url: "https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp"
            },
            title: "Stupid Commands I Got So Far.",
            url: "https://youtu.be/dQw4w9WgXcQ",
            description: "Don't click it.",
            fields: [{
                name: "./help",
                value: "This embed message"
              },
              {
                name: "./stupid",
                value: "Prints out `You Stupid`"
              },
              {
                name: "./jono",
                value: "Prints out `username, Jono agrees that you are stupid`"
              },
              {
                name: "./nick",
                value: "Prints out `nickname, Jono agrees that you are stupid`"
              },
              {
                name: "horse girl",
                value: "Any message that contains `horse girl`, bot will react 🐴 👧"
              },
              {
                name: "./url",
                value: "Return your avatarURL"
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: "https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp",
              text: "Jobo the Bot"
            }
          }
        });
    }
});

// React to phrase
client.on('message', function(message) {
    if (message.author.bot) return;
    if (message.content.includes('horse girl')) {
        message.react('🐴');
        message.react('👧');
    };
});       

//Set Status
client.once('ready', () => {
    console.log(`${client.user.username} is up and running!`);

    client.user.setPresence({
        status: 'available',
        activity: {
            name: 'Twitter why are you limiting my api access?',
            type: 'PLAYING',
        }
    });
});