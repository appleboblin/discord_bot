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
    const userNickname = message.member.nickname;
    let inventoryMenu = {
      embed: {
        color: 15277667,
        title: `**${userNickname}'s Inventory**`,
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/835471079303544834/845921169642618890/Screen_Shot_2021-05-23_at_3.06.38_PM.png',
        },
        fields: [],
        footer: {
          icon_url:
            'https://cdn.discordapp.com/attachments/835471079303544834/846039122346377276/Screen_Shot_2021-05-23_at_10.57.00_PM.png',
          text: 'placeholder',
        },
      },
    };

    const buyBox = async () => {
      // check if BoxType is empty
      if (shopItems.BoxType.length === 0)
        return message.channel.send('No boxes available');
      let boxList = Object.keys(shopItems.BoxType);
      //check if box type matches any in json
      if (boxList.includes(args.toString())) {
        // increase box count
        const totalBox = await purchase.addBox(guildId, userId, args);
        // take away coins needed
        const pay = await economy.removeCoins(guildId, userId);
        inventoryMenu.embed.footer.text = `Remaining Cock Coins: ${pay}`;
        // prepare result for menu
        const inventory = totalBox.replace(/[,]/g, '\n').replace(/[:]/g, ': ');
        // send info to menu
        inventoryMenu.embed.fields.push({
          name: `**Boxes**`,
          value: `\`\`\`${inventory}\`\`\``,
          inline: true,
        });
        // send menu to channel
        message.channel.send(inventoryMenu);
      } else {
        message.channel.send('Invalid box type!');
      }
    };
    // check if user have enough balance
    const check = await economy.checkBalance(guildId, userId, args);
    // if enough balance, buy
    if (check == 1) {
      buyBox();
      // if not enough balance, prompt the user
    } else if (check == 0) {
      message.channel.send(`You don't have enough Cock Coins!`);
      // error handling
    } else {
      logger.error('failed');
      message.send('Something went wrong');
    }
  },
};
