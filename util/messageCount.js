const logger = require('./logger');
const mongo = require('./mongo');
const messageCountSchema = require('../schemas/messageCountSchema');
module.exports = (client) => {
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
