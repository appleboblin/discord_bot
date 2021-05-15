// call logger
const logger = require('./logger');

// Destructure prefix
const { prefix } = require('../config.json');
// requirements
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {
  // Play local media
  playMedia: (client, aliases, callback) => {
    // make things into array
    if (typeof aliases === 'string') {
      aliases = [aliases];
    }

    client.on('message', (message) => {
      // Ignore if bot says it
      if (message.author.bot) return;
      const { content } = message;
      // Look for messages that have prefix and command
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`;
        // if theres a command, log it and callback
        if (content.startsWith(`${command} `) || content === command) {
          logger.info(`Running the command ${command}`);
          // Music Stuff
          const fileName = message.content.replace(`${command} `, '');
          let guildName = message.guild.name;
          let guildId = message.guild.id;
          let channelName = message.channel.name;
          let channelId = message.channel.id;

          if (fileName.length === 0) {
            // Check if there are any arguments
            return message.channel.send(
              `You didn't provide any arguments, ` + message.member.displayName
            );
          } else if (fileName === 'list') {
            const mediaFolder = './media/'; // folder path
            let fileList = []; // empty array
            fs.readdir(mediaFolder, (err, files) => {
              //read directory
              files.forEach((file) => {
                // repeat for each file
                fileList.push(file); // send to array
              });
              var string = fileList.join('\n'); // manipulate structure
              message.channel.send('```' + 'File List: \n' + string + '```');
              logger.info(
                "Send '" +
                  message.content +
                  "' to Server: " +
                  guildName +
                  '(' +
                  guildId +
                  ')' +
                  ', Channel: ' +
                  channelName +
                  '(' +
                  channelId +
                  ')'
              );
            });
          } else {
            const mediaFolder = './media/'; // folder path
            let fileList = []; // empty array
            fs.readdir(mediaFolder, (err, files) => {
              //read directory
              files.forEach((file) => {
                // repeat for each file
                fileList.push(file); // send to array
                logger.info('Found ' + file);
              });
              var string = fileList.join('\n'); // manipulate structure
              var mediaFile = fileName; //+ '.mp3'; // audio file
              if (string.indexOf(mediaFile) !== -1) {
                async function playMusic() {
                  // Set async function
                  if (message.member.voice.channel) {
                    // Check if anyone is in voice channel
                    const connection =
                      await message.member.voice.channel.join(); // wait until bot connect to voice channel
                    // Play audio
                    const dispatcher = connection.play('media/' + mediaFile); // get file to play

                    dispatcher.on('start', () => {
                      logger.info(soundFile + ' is now playing!');
                    });

                    dispatcher.on('finish', () => {
                      logger.info(mediaFile + ' has finished playing!');
                      message.guild.me.voice.channel.leave();
                      logger.info('Done playing, bot left voice channel.');
                    });

                    // handle errors
                    dispatcher.on('error', console.error);
                    return;
                  } else {
                    message.channel.send('No one is in voice chat.');
                    logger.info('No one is in voice chat to play. ');
                  }
                }
                playMusic(); // Call async function
              } else {
                message.channel.send(
                  `No matching file name. Type \`${prefix}` +
                    aliases +
                    ` list\` for available files.`
                );
                logger.info('Invalid argument');
              }
              return;
            });
          }
        }
      });
    });
  },

  // Play music
  playMusic: (client, aliases, callback) => {
    // make things into array
    if (typeof aliases === 'string') {
      aliases = [aliases];
    }

    client.on('message', (message) => {
      // Ignore if bot says it
      if (message.author.bot) return;
      //get content of message
      const { content } = message;
      const serverQueue = queue.get(message.guild.id);
      // Look for messages that have prefix and command
      aliases.forEach((alias) => {
        const command = `${prefix}${alias}`;
        // if theres a command, log it and callback
        if (content.startsWith(`${command} `) || content === command) {
          logger.info(`Running ${command}`);

          if (content.startsWith(`${prefix}play`)) {
            execute(message, serverQueue);
            return;
          } else if (content.startsWith(`${prefix}skip`)) {
            skip(message, serverQueue);
            return;
          } else if (content.startsWith(`${prefix}stop`)) {
            try {
              stop(message, serverQueue);
            } catch (error) {
              if (!message.guild.me.voice.channel) {
                logger.info('Bot not in voice channel');
                return message.channel.send('Not in voice channel'); // If the bot is not in a voice channel, then return a message
              }
              message.guild.me.voice.channel.leave(); //Leave voice channel
              logger.info('Booted bot from voice channel.');
              return;
            }
          }
        }
      });
    });
    // Music bot
    const queue = new Map();

    async function execute(message, serverQueue) {
      const args = message.content.split(' ');

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        logger.info('No one is in voice channel');
        return message.channel.send('Open my voice box!');
      }
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        logger.info('No permission to join voice channel');
        return message.channel.send("Hey Jono, I can't do that.");
      }
      //get song info
      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };
      // bot audio settings
      if (!serverQueue) {
        const queueContract = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        queue.set(message.guild.id, queueContract);

        queueContract.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContract.connection = connection;
          play(message.guild, queueContract.songs[0]);
        } catch (err) {
          //log error
          logger.info(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        //play song
        serverQueue.songs.push(song);
        logger.info('Music added to queue');
        return message.channel.send(`${song.title} added`);
      }
    }

    function skip(message, serverQueue) {
      if (!message.member.voice.channel) {
        logger.info('User needs to be in a voice channel to skip');
        return message.channel.send('Join voice to shutdown voice box.');
      }
      if (!serverQueue) {
        logger.info('No song to skip');
        return message.channel.send('Empty stomach.');
      }
      serverQueue.connection.dispatcher.end();
      logger.info('Audio Skipped');
    }

    function stop(message, serverQueue) {
      if (!message.member.voice.channel) {
        logger.info('User needs to be in a voice channel to skip');
        return message.channel.send('Join to stop!');
      }

      if (!serverQueue) {
        // yes, this is intentional error. It's a feature, not a bug
        error.info('No song to skip');
        //return message.channel.send('No content!');
      }

      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      logger.info('Stopped playing');
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
        .on('finish', () => {
          serverQueue.songs.shift();
          logger.info('Audio ended');
          play(guild, serverQueue.songs[0]);
        })
        .on('error', (error) => logger.info(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      logger.info('Playing requested audio');
      serverQueue.textChannel.send(`Now playing **${song.title}**`);
    }
  },
};
