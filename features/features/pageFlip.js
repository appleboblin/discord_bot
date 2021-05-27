const { Channel } = require('discord.js');
const logger = require('../../util/logger');

module.exports = (client) => {
  return client;
};
module.exports.pages = async (reactions, client, message, id, hi) => {
  const handleReaction = async (reaction, add, client) => {
    let second = {
      embed: {
        color: 15277667,
        title: `**page 2**`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/835471079303544834/845921169642618890/Screen_Shot_2021-05-23_at_3.06.38_PM.png',
        },
        fields: [
          {
            name: `no`,
            value: `nugget`,
            inline: false,
          },
        ],
        footer: {
          icon_url:
            'https://cdn.discordapp.com/attachments/835471079303544834/846039122346377276/Screen_Shot_2021-05-23_at_10.57.00_PM.png',
          text: 'placeholder',
        },
      },
    };
    let inventoryMenu = {
      embed: {
        color: 15277667,
        title: `**page 1**`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/835471079303544834/845921169642618890/Screen_Shot_2021-05-23_at_3.06.38_PM.png',
        },
        fields: [
          {
            name: `yes`,
            value: `pooplie`,
            inline: false,
          },
        ],
        footer: {
          icon_url:
            'https://cdn.discordapp.com/attachments/835471079303544834/846039122346377276/Screen_Shot_2021-05-23_at_10.57.00_PM.png',
          text: 'placeholder',
        },
      },
    };
    const emoji = reaction._emoji.name;

    const { guild } = reaction.message;

    if (add) {
      console.log(message);
      //reaction.message.reactions.remove('199872338609569792');
      await reaction.message.edit(second).catch(console.error);
      console.log('two');

      await reaction.users.remove('199872338609569792');
    } else {
      await reaction.message.edit(inventoryMenu).catch(console.error);
      console.log('one');
    }
  };

  message.client.on('messageReactionAdd', (reaction, client, user) => {
    handleReaction(reaction, true, client, user);
  });

  message.client.on('messageReactionRemove', (reaction, client) => {
    handleReaction(reaction, false, client);
  });

  /////////
  //const hi = await message.channel.send('test');
  hi.react('👍').then(() => hi.react('👎'));

  const filter = (reaction, user) => {
    return (
      ['👍', '👎'].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };

  hi.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then((collected) => {
      const reaction = collected.first();

      if (reaction.emoji.name === '👍') {
        message.reply('you reacted with a thumbs up.');
      } else {
        message.reply('you reacted with a thumbs down.');
      }
    })
    .catch((collected) => {
      message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
    });
};
