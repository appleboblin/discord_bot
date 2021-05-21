const logger = require('../../util/logger');
const itemList = require('../../asset/shop/shopItems.json');
module.exports = {
  commands: ['shop'],
  //maxArgs: 0,
  description: 'Shop menu',
  //expectedArgs: '[Target @]',
  callback: async (message) => {
    let shopMenu = {
      embed: {
        color: 15277667,
        author: {
          name: 'Shop of Ding Ding',
          icon_url:
            'https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp',
        },
        title: 'Cashing Out',
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/214357162355326977/845321115589017620/laikeidle_0001.png',
        },
        fields: [],
        timestamp: new Date(),
        footer: {
          icon_url:
            'https://cdn.discordapp.com/avatars/199872338609569792/d2ebe56ba66a5f95db256e48ed41c752.webp',
          text: 'Jobo the Bot',
        },
      },
    };
    if (itemList.shop.length === 0)
      return message.channel.send('No items in shop.');

    itemList.shop.map((value, index) => {
      shopMenu.embed.fields.push({
        name: `${value.item}`,
        value: `\`\`\`¢ ${value.price}\`\`\``,
        inline: true,
      });
    });

    message.channel.send(shopMenu);
  },
};
