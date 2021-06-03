const { Channel } = require('discord.js');
const logger = require('../../util/logger');

module.exports = (client) => {};
module.exports.pages = async (message, client) => {
  let pages = []; // array of pages
  let page = 1; // page start
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
  inventoryMenu = {
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
        text: `Page ${page} of ${pages.length}`,
      },
    },
  };
  pages = [inventoryMenu, second]; // array of pages
  const id = message.author.id;
  console.log(id);
  const hi = await message.channel.send(inventoryMenu);
  /////////
  //const hi = await message.channel.send('test');
  hi.react('⬅️').then(() => hi.react('➡️'));

  const filter = (reaction, user) => {
    return (
      ['⬅️', '➡️'].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  const test = async () => {
    hi.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === '⬅️') {
          message.reply('you reacted with a left.');
          reaction.users.remove(id);
          if (page === 1) return test(); // make sure can't go back if on first page
          page--; // subtract one page number if can go back
          inventoryMenu.embed.footer.text = `Page ${page} of ${pages.length}`;
          hi.edit(inventoryMenu);
          test();
        } else {
          message.reply('you reacted with a right');
          reaction.users.remove(id);
          if (page === pages.length) return test(); // make sure can't go over last page
          page++; // add one page number if can go forward
          inventoryMenu.embed.footer.text = `Page ${page} of ${pages.length}`;
          hi.edit(second);
          test();
        }
      })
      .catch((collected) => {
        return message.reply('Not being watched anymore');
      });
  };
  test();
};
