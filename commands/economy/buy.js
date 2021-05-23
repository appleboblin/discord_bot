const logger = require('../../util/logger');
const shopItems = require('../../asset/shop/shopItems.json');
const purchase = require('../../features/economy/purchaseBox');
const economy = require('../../features/economy/economy');

module.exports = {
  commands: 'buy',
  description: 'Buy Loot Box',
  expectedArgs: '<rarity> `normal`, `rare`',
  minArgs: 1,
  maxArgs: 1,
  //requiredRoles: [`test`],
  //permissions: ['SEND_MESSAGES'],
  //permissionError = 'You do not have permission to run this command.',
  callback: async (message, args) => {
    const guildId = message.guild.id;
    const userId = message.author.id;
    const userTag = message.author.tag;
    const userName = message.author.username;
    let inventoryMenu = {
      embed: {
        color: 15277667,
        title: `**${userName}'s Inventory**`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/835471079303544834/845921169642618890/Screen_Shot_2021-05-23_at_3.06.38_PM.png',
        },
        fields: [],
      },
    };
    if (shopItems.BoxType.length === 0)
      return message.channel.send('No boxes available');
    let boxList = Object.keys(shopItems.BoxType);
    if (boxList.includes(args.toString())) {
      const totalBox = await purchase.addBox(guildId, userId, args);
      const inventory = totalBox.replace(',', '\n').replace(/[:]/g, ': ');
      inventoryMenu.embed.fields.push({
        name: `**Boxes**`,
        value: `\`\`\`${inventory}\`\`\``,
        inline: true,
      });

      message.channel.send(inventoryMenu);
    } else {
      message.channel.send('Invalid box type!');
    }
    /*
    const buyBox = async () => {
      if (shopItems.BoxType.length === 0)
        return message.channel.send('No boxes available');
      let boxList = Object.keys(shopItems.BoxType);
      if (boxList.includes(args.toString())) {
        const totalBox = await purchase.addBox(guildId, userId, args);
        const inventory = totalBox.replace(',', '\n').replace(/[:]/g, ': ');
        inventoryMenu.embed.fields.push({
          name: `**Boxes**`,
          value: `\`\`\`${inventory}\`\`\``,
          inline: true,
        });

        message.channel.send(inventoryMenu);
      } else {
        message.channel.send('Invalid box type!');
      }
    };
    //let hi = await purchase.getBox(guildId, userId, args);
    //console.log(hi);
    const check = await economy.checkBalance(guildId, userId, args);
    if (check == 1) {
      console.log('enough');
      buyBox();
    } else if (check == 0) {
      console.log('not enough');
    } else {
      console.log('failed');
    }*/
  },
};
