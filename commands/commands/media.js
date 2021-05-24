// requirements
const fs = require('fs');
// call logger
const logger = require('../../util/logger');

module.exports = {
  commands: ['media', 'm'],
  description: 'Plays local media',
  expectedArgs: 'list/<media>',
  minArgs: 1,
  maxArgs: 1,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, args) => {
    let fileName = args.toString();
    if (fileName === 'list') {
      let fileList = []; // empty array
      const getMedias = async (mediaFolder, callback) => {
        fs.readdir(mediaFolder, (err, content) => {
          if (err) return callback(err);
          callback(null, content);
        });
      };

      await getMedias('./asset/media', (err, files) => {
        //read directory
        files.forEach((file) => {
          // repeat for each file
          fileList.push(file); // send to array
        });
        let string = fileList.join('\n'); // manipulate structure
        message.channel.send('```' + 'File List: \n' + string + '```');
        logger.info(
          `Send ${message.content} in Server: ${message.guild.name}(${message.guild.id}), Channel: ${message.channel.name}(${message.channel.id})`
        );
      });
    } else {
      let fileList = []; // empty array
      const getMedias = async (mediaFolder, callback) => {
        fs.readdir(mediaFolder, (err, content) => {
          if (err) return callback(err);
          callback(null, content);
        });
      };

      await getMedias('./asset/media', (err, files) => {
        //read directory
        files.forEach((file) => {
          // repeat for each file
          fileList.push(file); // send to array
        });
        let string = fileList.join('\n'); // manipulate structure
        let mediaFile = fileName; //+ '.mp3'; // audio file
        try {
          if (string.indexOf(mediaFile) !== -1) {
            const playMusic = (async () => {
              // Set async function
              if (message.member.voice.channel) {
                // Check if anyone is in voice channel
                const connection = await message.member.voice.channel.join(); // wait until bot connect to voice channel
                // Play audio
                const dispatcher = connection.play(
                  './asset/media/' + mediaFile
                ); // get file to play

                dispatcher.on('start', () => {
                  logger.info(mediaFile + ' is now playing!');
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
            })(); // Call async function
          } else {
            message.channel.send(
              `No matching file name. Type \`${prefix}` +
                aliases +
                ` list\` for available files.`
            );
            logger.info('Invalid argument');
          }
          return;
        } catch {
          message.channel.send(`Please have a valid file`);
        }
      });
    }
  },
};
