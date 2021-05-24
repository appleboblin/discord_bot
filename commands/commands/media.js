// requirements
const ytdl = require('ytdl-core');
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
        console.log(files);

        //read directory
        files.forEach((file) => {
          // repeat for each file
          let single = file.substring(0, file.lastIndexOf('.')) || file;
          fileList.push(single); // send to array
        });
        let string = fileList.join('\n'); // manipulate structure
        message.channel.send('```' + 'File List: \n' + string + '```');
        logger.info(
          `Send ${message.content} in Server: ${message.guild.name}(${message.guild.id}), Channel: ${message.channel.name}(${message.channel.id})`
        );
      });
    } else {
      console.log('hah');
    }
  },
};
