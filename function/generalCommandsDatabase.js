// requirements
const mongo = require('../util/mongo');
const { command } = require('../features/features/generalCommands');
const welcomeSchema = require('../schemas/welcomeSchema');
const messageCountSchema = require('../schemas/messageCountSchema');
const logger = require('../util/logger');
const redis = require('../util/redis');

const welcome = (client) => {
  //!setwelcome <message>
  const cache = {}; // guildId: [channelId, text]

  command(client, 'setwelcome', async (message) => {
    const { member, channel, content, guild } = message;

    if (!member.hasPermission('ADMINISTRATOR')) {
      channel.send('You do not have permission to run this command.');
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

// Message Counter
const messageCounter = (client) => {
  // listener
  client.on('message', async (message) => {
    const { author } = message;
    const { id } = author;
    // add message to database
    await mongo().then(async (mongoose) => {
      try {
        await messageCountSchema
          .findOneAndUpdate(
            {
              _id: id,
            },
            {
              // increase message count my one
              $inc: {
                messageCount: 1,
              },
            },
            {
              upsert: true,
            }
          )
          .exec();
      } finally {
        // always close connection
        mongoose.connection.close();
      }
    });
  });
};

// Mute user
const mute = (client) => {
  const redisKeyPrefix = 'muted-';

  redis.expire((message) => {
    if (message.startsWith(redisKeyPrefix)) {
      const split = message.split('-');

      const memberId = split[1];
      const guildId = split[2];

      const guild = client.guilds.cache.get(guildId);
      const member = guild.members.cache.get(memberId);

      const role = getRole(guild);

      member.roles.remove(role);
      logger.info(
        `Mute time out, unmuted ${member.user.username}#${member.user.discriminator}(${member.id})`
      );
    }
  });

  const getRole = (guild) => {
    return guild.roles.cache.find((role) => role.name === 'Muted');
  };

  const giveRole = (member) => {
    const role = getRole(member.guild);
    if (role) {
      member.roles.add(role);
      logger.info(
        `Muted ${member.user.username}#${member.user.discriminator}(${member.id})`
      );
    }
  };
  const removeRole = (member) => {
    const role = getRole(member.guild);
    if (role) {
      member.roles.remove(role);
      logger.info(
        `Unmuted ${member.user.username}#${member.user.discriminator}(${member.id})`
      );
    }
  };
  const onJoin = async (member) => {
    const { id, guild } = member;

    const redisClient = await redis();
    try {
      redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
        if (err) {
          logger.error('Redis GET error:', err);
        } else if (result) {
          giveRole(member);
        } else {
          logger.error('The user is not muted');
        }
      });
    } finally {
      redisClient.quit();
    }
  };

  command(client, 'simjoin2', (message) => {
    onJoin(message.member);
  });

  client.on('guildMemberAdd', (member) => {
    onJoin(member);
  });
  command(client, 'unmute', async (message) => {
    const { member, channel, content, mentions, guild } = message;

    if (!member.hasPermission('ADMINISTRATOR')) {
      channel.send('You do not have permission to run this command.');
      return;
    }
    const target = mentions.users.first();

    if (!target) {
      channel.send('Please tag a user to mute.');
      return;
    }

    const { id } = target;

    // connect to redis client
    const redisClient = await redis();
    try {
      redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
        if (err) {
          logger.error('Redis GET error:', err);
        } else if (result) {
          removeRole(member);
        } else {
          logger.error('The user is not muted');
        }
      });
    } finally {
      redisClient.quit();
    }
  });
  command(client, 'mute', async (message) => {
    // !mute @ duration duration_type

    const syntax = '!mute <@> <duration #> <m, h, d, or life>';

    const { member, channel, content, mentions, guild } = message;

    if (!member.hasPermission('ADMINISTRATOR')) {
      channel.send('You do not have permission to run this command.');
      return;
    }

    // mentioned user
    const target = mentions.users.first();
    const { id } = target;
    const targetMember = guild.members.cache.get(id);
    // connect to redis client
    const redisClient = await redis();
    // formatting
    const split = content.trim().split(' ');

    // check if someone is mentioned
    if (!target) {
      channel.send('Please tag a user to mute.');
      return;
    }
    let life = 'life';
    if (split[2].includes(life)) {
      // Perm mute
      giveRole(targetMember);
      try {
        const redisKey = `${redisKeyPrefix}${id}-${guild.id}`;
        // no TTL send
        redisClient.set(redisKey, 'true');
      } finally {
        redisClient.quit();
      }
      return;
    } else if (split.length !== 4) {
      channel.send('Please use the correct command syntax: ' + syntax);
      return;
    }
    // store duration type
    const duration = split[2];
    const durationType = split[3];

    if (isNaN(duration)) {
      channel.send('Please provide a number for the duration. ' + syntax);
      return;
    }
    // multiply to match the command
    const durations = {
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
      life: -1,
    };
    //see if duration type is actually included
    if (!durations[durationType]) {
      channel.send('Please provide a valid duration type. ' + syntax);
      return;
    }
    // get correct time
    const seconds = duration * durations[durationType];
    // 5 m
    // seconds = 5 * m

    // mute user
    giveRole(targetMember);
    // log that to data base
    try {
      const redisKey = `${redisKeyPrefix}${id}-${guild.id}`;

      if (seconds > 0) {
        redisClient.set(redisKey, 'true', 'EX', seconds);
      } else {
        // not send TTL if value less than 0
        redisClient.set(redisKey, 'true');
      }
    } finally {
      redisClient.quit();
    }
  });
};

module.exports = {
  welcome,
  messageCounter,
  mute,
};
