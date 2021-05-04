// Initalize
require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');

// Start Discord.js
const client = new Discord.Client();

// Bot login
client.login(process.env.BOT_TOKEN)

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
  follow: '1382194772023123969', // @BrgrArt
});
//1382194772023123969 @BrgrArt
//1179802346643021825 @applenugget285
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
                         console.log("New image sent to channel")
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
    // Split into arrays of strings when there is space
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

    if ( command === 'channel') {
        message.channel.send(message.channel.id);
    }

    if ( command === 'cloud') {
        message.channel.send(function end(words) { console.log(JSON.stringify(words)); } );
    }

    if ( command === 'fetch') {
        const channel = client.channels.cache.get(message.channel.id);
        channel.messages.fetch({ limit: 100 }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            // Get dates
            let date_ob = new Date();
            // Current date
            // Adjust 0 before single digit date
            let date = ("0" + date_ob.getDate()).slice(-2);
            // Current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            // Current year
            let year = date_ob.getFullYear();
            // Current hours
            let hours = date_ob.getHours();
            // Current minutes
            let minutes = date_ob.getMinutes();
            // Current seconds
            let seconds = date_ob.getSeconds();
            // Set path and unique file name
            let dir = "./fetch/" + year + "-" + month + "-" + date + "_" + hours + ":" + minutes + ":" + seconds + ".json";
            // Create empty array
            let discordMessage = [];
            // Add each message to array
            messages.forEach(message => discordMessage.push(message.content))
            // Save array to file
            fs.writeFileSync(dir, JSON.stringify(discordMessage, null, 4));
            console.log(`Saved messages to ${dir} `);
            // Send file to channel
            message.channel.send({
              files: [dir]
            });

          });
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
              {
                name: "./fetch",
                value: "Fetch 100 most recent messages from the channel and send as `.json`"
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
            name: 'Fake Jono 1.0',
            type: 'PLAYING',
        }
    });
});