// Initalize
require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');
const ytdl = require("ytdl-core");
var winston = require('winston');
require('winston-daily-rotate-file');
// Start Discord.js
const client = new Discord.Client();
// Bot login
client.login(process.env.BOT_TOKEN)
// Logging config

const logConfiguration = {
  transports: [
      new winston.transports.Console(),
      new winston.transports.DailyRotateFile({
        filename: 'logs/Discord-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m',
        maxFiles: '14d'
      })
  ],
  format: winston.format.combine(
      winston.format.timestamp({
         format: 'MMM-DD-YYYY HH:mm:ss'
     }),
      winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
  )
};
const logger = winston.createLogger(logConfiguration);

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
/*
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
                         logger.info("New image sent to channel")
                    })
                } catch (error) {
                logger.error(error.message);
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
    // Remove prefix and get arguments
    const args = message.content.slice(prefix.length).trim().split(' ');
    // Make it lower case and assign to 'command'
    const command = args.shift().toLowerCase();

   // Music Que constant
    const serverQueue = queue.get(message.guild.id);
    let guildname = message.guild.name
    let guildid = message.guild.id
    let channelname = message.channel.name
    let channelid = message.channel.id
    // Commands
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
      logger.info("Send './stupid' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
      return;
    } else if (message.content.startsWith(`${prefix}jono`)) {
      message.channel.send(message.author.username + ', Jono agrees that you are stupid');
      logger.info("Send './jono' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
      return;
    } else if (message.content.startsWith(`${prefix}nick`)) {
      message.channel.send(message.member.displayName + ', Jono agrees that you are stupid');
      return;
    } else if (message.content.startsWith(`${prefix}url`)) {
      message.channel.send(message.author.displayAvatarURL("jpg"));
      logger.info("Send './url' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
      return;
    } else if (message.content.startsWith(`${prefix}serverinfo`)) {
      message.channel.send("Server: " + guildname + "(" + guildid + "), Channel: <#" + channelid + ">(" + channelid + ")");
      logger.info("Send './serverinfo' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
      return;
    } else if (message.content.startsWith(`${prefix}fetch`)) {
      const channel = client.channels.cache.get(message.channel.id);
        channel.messages.fetch({ limit: 100 }).then(messages => {
            logger.info(`Received ${messages.size} messages`);
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
            logger.info(`Saved messages to ${dir} `);
            // Send file to channel
            message.channel.send({
              files: [dir]
            });
            logger.info("Send './fetch' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
          });
      return;
    } else if (message.content.startsWith(`${prefix}sound`)) {
      if (!args.length) { // Check if there are any arguments
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      } else if (args[0] === 'list') {
        const soundFolder = './mp3/'; // folder path
        let fileList = []; // empty array
        fs.readdir(soundFolder, (err, files) => { //read directory
          files.forEach(file => { // repeat for each file
            fileList.push(file); // send to array
            logger.info("Found " + file) 
          });
          var string = fileList.join('\n'); // manipulate structure
        message.channel.send("```" + "File List: \n" + string + "```");
        logger.info("Send './sound list' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
        });
      } else {
        const soundFolder = './mp3/'; // folder path
        let fileList = []; // empty array
        fs.readdir(soundFolder, (err, files) => { //read directory
          files.forEach(file => { // repeat for each file
            fileList.push(file); // send to array
            logger.info("Found " + file)
          });
          var string = fileList.join('\n'); // manipulate structure
        var soundFile = args[0] +'.mp3' // audio file
        if(string.indexOf(soundFile) !== -1) {
          async function playMusic() { // Set async function
            if (message.member.voice.channel) { // Check if anyone is in voice channel
              const connection = await message.member.voice.channel.join(); // wait until bot connect to voice channel
              // Play audio
              const dispatcher = connection.play('mp3/'+soundFile); // get file to play
      
              dispatcher.on('start', () => {
                logger.info(soundFile + ' is now playing!');
              });
      
              dispatcher.on('finish', () => {
                  logger.info(soundFile + ' has finished playing!');
                  message.guild.me.voice.channel.leave();
                  logger.info("Done playing, bot left voice channel.")
              });
      
              // handle errors 
              dispatcher.on('error', console.error);
              return;
            } else {
              message.channel.send("No one is in voice chat.")
              logger.info("No one is in voice chat to play. ")
            }
          }
          playMusic(); // Call async function
        } else {
          message.channel.send("No matching file name. Type `./sound list` for avaliable files.")
          logger.info("Invalid argument")
        }
          return;
        });
      };
    } else if (message.content.startsWith(`${prefix}leave`)) {
      if(!message.guild.me.voice.channel) {
        logger.info("Bot not in voice channel")
        return message.channel.send("Not in voice channel"); // If the bot is not in a voice channel, then return a message
      }
      message.guild.me.voice.channel.leave(); //Leave voice channel
      logger.info("Booted bot from voice channel.")
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
          {
            name: "./play `YouTube URL`",
            value: "Play YouTube audio"
          },
          {
            name: "./skip",
            value: "Skip queue"
          },
          {
            name: "./stop",
            value: "Stop audio"
          },
          {
            name: "./sound `arguments`",
            value: "`./sound list` for audio list. `./sound filename` to play audio, don't need `.mp3`"
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url: "https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp",
          text: "Jobo the Bot"
        }
      }
    });
    logger.info("Send './help' to Server: " + guildname + "(" + guildid + ")"+ ", Channel: " + channelname + "(" + channelid + ")")
      return;
    } else {
      message.channel.send("You Idiot, valid commands please!");
      logger.info("Invalid command")
    };
});

// Music bot
const queue = new Map();

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel){
    logger.info("No one is in voice channel")
    return message.channel.send(
      "Open my voice box!"
    )};
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    logger.info("No permission to join voice channel")
    return message.channel.send(
      "Hey Jono, I can't do that."
    );
  }
//get dong info
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };
// bot audiosettings
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
    } catch (err) { //log error
      logger.info(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else { //play song
    serverQueue.songs.push(song);
    logger.info("Music added to quequ");
    return message.channel.send(`${song.title} added`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel){
    logger.info("User needs to be in a voice channel to skip")
    return message.channel.send(
      "Join voice to shutdown voice box."
    )};
  if (!serverQueue){
    logger.info("No song to skip")
    return message.channel.send("Empty stomach.")};
  serverQueue.connection.dispatcher.end();
  logger.info("Audio Skipped")
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel){
    logger.info("User needs to be in a voice channel to skip")
    return message.channel.send(
      "Join to stop!"
    )};
    
  if (!serverQueue){
    logger.info("No song to skip")
    return message.channel.send("No content!")};
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  logger.info("Stopped playing")
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
      logger.info("Audio ended")
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => logger.info(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  logger.info('Playing requested audio')
  serverQueue.textChannel.send(`Now playing **${song.title}**`);
};

// React to phrase
client.on('message', function(message) {
    if (message.author.bot) return;
    if (message.content.includes('horse girl')) {
        message.react('🐴');
        message.react('👧');
        logger.info("Reacted to horse girl")
    };
});       

//Set Status
client.once('ready', () => {
    logger.info(`${client.user.username} is up and running.`);

    client.user.setPresence({
        status: 'available',
        activity: {
            name: 'Fake Jono 1.3',
            type: 'PLAYING',
        }
    });
});

client.once("reconnecting", () => {
  logger.info(`${client.user.username} is reconnecting.`);
});

client.once("disconnect", () => {
  logger.info(`${client.user.username} is disconnected.`);
});

// Set bot name
client.on('ready', function() {
  client.user.setUsername("JoBot");
  logger.info("Bot Name set")
});