const mongo = require('../../util/mongo');
const economy = require('./economy');
const logger = require('../../util/logger');

module.exports = (client) => {};

// buy menu
module.exports.chest = async (message) => {
  const guildId = message.guild.id;
  const userId = message.author.id;
  const userTag = message.author.tag;
  const userName = message.author.username;
  const userNickname = message.member.nickname;
  const result = await economy.getBox(guildId, userId);

  let chestMenu = {
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
  let inventory;
  try {
    // make string look presentable
    let total = JSON.stringify(result);
    // using regular expression
    inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');

    const pay = await economy.getCoins(guildId, userId);
    chestMenu.embed.footer.text = `Remaining Cock Coins: ${pay}`;
    // prepare result for menu
    inventory = inventory.replace(/[,]/g, '\n').replace(/[:]/g, ': ');
  } catch {
    logger.error(`failed to open inventory`);
  } finally {
    // send info to menu
    chestMenu.embed.fields.push({
      name: `**Boxes**`,
      value: `\`\`\`${inventory}\`\`\``,
      inline: true,
    });
    message.channel.send(chestMenu);
  }
};

module.exports.inv = async (message) => {
  const guildId = message.guild.id;
  const userId = message.author.id;
  const userTag = message.author.tag;
  const userName = message.author.username;
  const userNickname = message.member.nickname;
  const boxResult = await economy.getBox(guildId, userId);
  const inventoryResult = await economy.getInventory(guildId, userId);
  let pages = []; // array of pages
  let page = 1; // page start
  let boxMenu = {
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
  let itemMenu = {
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
        text: `I can't figure out how to do this part dynamically :(`,
      },
    },
  };
  let chest;
  try {
    // make string look presentable
    let total = JSON.stringify(boxResult);
    // using regular expression
    chest = total.replace(/[^:,0-9a-zA-Z]/g, '');

    const pay = await economy.getCoins(guildId, userId);
    boxMenu.embed.footer.text = `Remaining Cock Coins: ${pay}`;
    // prepare result for menu
    chest = chest.replace(/[,]/g, '\n').replace(/[:]/g, ': ');
  } catch {
    logger.error(`failed to open inventory`);
  } finally {
    // send info to menu
    boxMenu.embed.fields.push({
      name: `**Boxes**`,
      value: `\`\`\`json\n${chest}\`\`\``,
      inline: true,
    });
  }
  let inventory;
  try {
    // make string look presentable
    let total = JSON.stringify(inventoryResult);

    // using regular expression
    inventory = total.replace(/[^:,0-9a-zA-Z]/g, '');
    // prepare result for menu
    inventory = inventory.replace(/[:]/g, ': ');
    //.replace(/[,]/g, '\n')
    trimmed = inventory.replace(/([A-Z])/g, '$1').trim();
    itemList = trimmed.split(',');
  } catch {
    logger.error(`failed to open inventory`);
  } finally {
    // send info to menu
    itemMenu.embed.fields.push({
      name: `**Items**`,
      value: `\`\`\`json\n${trimmed}\`\`\``,
      inline: false,
    });
  }

  const id = message.author.id; // find user id
  const msg = await message.channel.send(boxMenu); // send embed
  msg.react('⬅️').then(() => msg.react('➡️')); // react to embed

  const filter = (reaction, user) => {
    // check reaction, make sure bot does not react to its own reaction
    return (
      ['⬅️', '➡️'].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  const embedMenu = async () => {
    msg
      .awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }) // set watch time. 30 seconds
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === '⬅️') {
          reaction.users.remove(id); //remove user reaction, so user can react again to flip between pages
          if (page === 1) return embedMenu(); // make sure can't go back if on first page
          page--; // subtract one page number if can go back
          msg.edit(boxMenu); // edit embed
          embedMenu(); // call function again to watch embed
        } else {
          reaction.users.remove(id); //remove user reaction, so user can react again to flip between pages
          if (page === pages.length) return embedMenu(); // make sure can't go over last page
          page++; // add one page number if can go forward
          msg.edit(itemMenu); // edit embed
          embedMenu(); // call function again to watch embed
        }
      })
      .catch((collected) => {
        return;
      });
  };
  embedMenu(); // call function to watch embed
};
