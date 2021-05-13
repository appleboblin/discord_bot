// Destructure prefix
const { prefix } = require('../config.json');
const fs = require('fs');
// Handle command messages
module.exports = (client, aliases, callback) => {
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
        console.log(`Running the command ${command}`);
        // Music Stuff
        const fileName = message.content.replace('.audio ', '');
        let guildname = message.guild.name;
        let guildid = message.guild.id;
        let channelname = message.channel.name;
        let channelid = message.channel.id;

        if (fileName.length === 0) {
          // Check if there are any arguments
          return message.channel.send(
            `You didn't provide any arguments, ${message.author}!`
          );
        } else if (fileName === 'list') {
          const soundFolder = './mp3/'; // folder path
          let fileList = []; // empty array
          fs.readdir(soundFolder, (err, files) => {
            //read directory
            files.forEach((file) => {
              // repeat for each file
              fileList.push(file); // send to array
            });
            var string = fileList.join('\n'); // manipulate structure
            message.channel.send('```' + 'File List: \n' + string + '```');
            console.log(
              "Send './sound list' to Server: " +
                guildname +
                '(' +
                guildid +
                ')' +
                ', Channel: ' +
                channelname +
                '(' +
                channelid +
                ')'
            );
          });
        } else {
          const soundFolder = './mp3/'; // folder path
          let fileList = []; // empty array
          fs.readdir(soundFolder, (err, files) => {
            //read directory
            files.forEach((file) => {
              // repeat for each file
              fileList.push(file); // send to array
              console.log('Found ' + file);
            });
            var string = fileList.join('\n'); // manipulate structure
            var soundFile = fileName + '.mp3'; // audio file
            if (string.indexOf(soundFile) !== -1) {
              async function playMusic() {
                // Set async function
                if (message.member.voice.channel) {
                  // Check if anyone is in voice channel
                  const connection = await message.member.voice.channel.join(); // wait until bot connect to voice channel
                  // Play audio
                  const dispatcher = connection.play('mp3/' + soundFile); // get file to play

                  dispatcher.on('start', () => {
                    console.log(soundFile + ' is now playing!');
                  });

                  dispatcher.on('finish', () => {
                    console.log(soundFile + ' has finished playing!');
                    message.guild.me.voice.channel.leave();
                    console.log('Done playing, bot left voice channel.');
                  });

                  // handle errors
                  dispatcher.on('error', console.error);
                  return;
                } else {
                  message.channel.send('No one is in voice chat.');
                  console.log('No one is in voice chat to play. ');
                }
              }
              playMusic(); // Call async function
            } else {
              message.channel.send(
                'No matching file name. Type `./sound list` for avaliable files.'
              );
              console.log('Invalid argument');
            }
            return;
          });
        }
      }
    });
  });
};
