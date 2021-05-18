// requirements
const mongo = require('./mongo');
const { command } = require('./generalCommands');
const welcomeSchema = require('./schemas/welcomeSchema');
const logger = require('./logger');

module.exports = (client) => {
  //!setwelcome <message>
  const cache = {}; // guildId: [channelId, text]

  command(client, 'setwelcome', async (message) => {
    const { member, channel, content, guild } = message;

    if (!member.hasPermission('ADMINISTRATOR')) {
      channel.send('No permission');
      return;
    }

    let text = content;

    const split = text.split(' ');
    // detect if have a message after command
    if (split.length < 2) {
      channel.send('Please provide a welcome message.');
      return;
    }

    split.shift();
    text = split.join(' ');
    // store in local cache
    cache[guild.id] = [channel.id, text];
    // set mongo connection
    await mongo().then(async (mongoose) => {
      try {
        // Structure
        await welcomeSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            channelId: channel.id,
            text,
          },
          // update if already have entry
          {
            upsert: true,
          }
        );
      } finally {
        // close connection
        mongoose.connection.close();
      }
    });
  });

  // simulate join to test
  const onJoin = async (member) => {
    const { guild } = member;

    let data = cache[guild.id];
    // Check if have local cache, if not, load from data base
    if (!data) {
      logger.info('FETCHING FROM DATABASE');

      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchema.findOne({ _id: guild.id });

          cache[guild.id] = data = [result.channelId, result.text];
        } finally {
          mongoose.connection.close();
        }
      });
    }

    const channelId = data[0];
    const text = data[1];

    const channel = guild.channels.cache.get(channelId);
    // Allows @ user <@>!
    channel.send(text.replace(/<@>/g, `<@${member.id}>`));
  };
  // simulate when a new user joins
  command(client, 'simjoin', (message) => {
    onJoin(message.member);
  });
  // send message when a new user joins
  client.on('guildMemberAdd', (member) => {
    onJoin(member);
  });
};
