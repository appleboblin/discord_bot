const logger = require('../../util/logger');
const page = require('../../features/features/pageFlip');

module.exports = {
  commands: ['page'],
  description: 'Page testing',
  //expectedArgs: 'hi',
  //minArgs: 0,
  //maxArgs: 0,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, args, text, client) => {
    const reactions = [];
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
    const hi = await message.channel.send(inventoryMenu);
    const id = hi.author.lastMessageID;
    //console.log(hi);
    reactions.push('⬅️');
    reactions.push('➡️');
    hi.react('⬅️');
    await hi.react('➡️');

    console.log(id);

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
    await page.pages(reactions, client, message, id, hi);
    //return arguments.globalVariable;
  },
};
