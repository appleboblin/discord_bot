// Initalize
require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');
const ytdl = require("ytdl-core");

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
*/

// Commands
// Set prefix
const prefix = './';
client.on('message', async message => {
    // Check if bot sends the message. 
    if (message.author.bot) return;
    // Looks for message starting with prefix
    if (!message.content.startsWith(prefix)) return;
    /*
    // Remove prefix
    const commandBody = message.content.slice(prefix.length);
    // Split into arrays of strings when there is space
    const args = commandBody.split(' ');
    // Make it lower case and assign to 'command'
    const command = args.shift().toLowerCase();
    */
    //music
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
      execute(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
      skip(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
      stop(message, serverQueue);
      return;
    } else if (message.content.startsWith(`${prefix}stupid`)) {
      message.channel.send('You stupid.');
      return;
    } else if (message.content.startsWith(`${prefix}jono`)) {
      message.channel.send(message.author.username + ', Jono agrees that you are stupid');
      return;
    } else if (message.content.startsWith(`${prefix}nick`)) {
      message.channel.send(message.member.displayName + ', Jono agrees that you are stupid');
      return;
    } else if (message.content.startsWith(`${prefix}url`)) {
      message.channel.send(message.author.displayAvatarURL("jpg"));
      return;
    } else if (message.content.startsWith(`${prefix}channel`)) {
      message.channel.send(message.channel.id);
      return;
    } else if (message.content.startsWith(`${prefix}fetch`)) {
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
      return;
    } else if (message.content.startsWith(`${prefix}sound1`)) {
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        // Play audio, see below
        const dispatcher = connection.play('mp3/jono.mp3');

        dispatcher.on('start', () => {
          console.log('jono.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('jono.mp3 has finished playing!');
            message.guild.me.voice.channel.leave();
        });

        // Always remember to handle errors 
        dispatcher.on('error', console.error);
        return;}
    } else if (message.content.startsWith(`${prefix}sound2`)) {
      if (message.member.voice.channel) {
          const connection = await message.member.voice.channel.join();
          // Play audio, see below
          const dispatcher = connection.play('mp3/MP5_SMG-GunGuru-703432894.mp3');
  
          dispatcher.on('start', () => {
            console.log('MP5_SMG-GunGuru-703432894.mp3 is now playing!');
          });
  
          dispatcher.on('finish', () => {
              console.log('MP5_SMG-GunGuru-703432894.mp3 has finished playing!');
              message.guild.me.voice.channel.leave();
          });
  
          // Always remember to handle errors 
          dispatcher.on('error', console.error);
          return;}
        } else if (message.content.startsWith(`${prefix}liu`)) {
          if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            // Play audio, see below
            const dispatcher = connection.play('mp3/liu.mp3');
    
            dispatcher.on('start', () => {
              console.log('liu.mp3 is now playing!');
            });
    
            dispatcher.on('finish', () => {
                console.log('liu.mp3 has finished playing!');
                message.guild.me.voice.channel.leave();
            });
    
            // Always remember to handle errors 
            dispatcher.on('error', console.error);
            return;}
    } else if (message.content.startsWith(`${prefix}leave`)) {
      if(!message.guild.me.voice.channel) return message.channel.send("Not in voice channel"); //If the bot is not in a voice channel, then return a message
      message.guild.me.voice.channel.leave(); //Leave the voice channel
      console.log('Left voice channel');
      return;
    } else if (message.content.startsWith(`${prefix}help`)) {
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
            value: "Prints out `You Stupid.`"
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
      return;
    } else {
      message.channel.send("You Idiot, valid commands please!");
    };
/*
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
                value: "Prints out `You Stupid.`"
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
    */
});

//music
const queue = new Map();
client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});
/*
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You Idiot, valid commands please!");
  }
});
*/

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Open my voice box!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Hey Jono, I can't do that."
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} added`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Join voice to shitdown voice box."
    );
  if (!serverQueue)
    return message.channel.send("Empty stomach.");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Join to stop!"
    );
    
  if (!serverQueue)
    return message.channel.send("No content!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing **${song.title}**`);
};


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
