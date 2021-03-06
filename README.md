# discord_bot

A bot for Discord

# Setup

1. Clone repo and `cd` to directory
2. Create `token.json` in the directory, copy your bot token created from [discord developer portal](https://discord.com/developers/applications) into the file. Format: `{"discord_token": "Your bot token"}`
3. Setup and run [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
4. Configure `index.js` and `config.json` as needed, `node index.js` to start

- `bot.js` is using a new command handler, still working in progress. Need to combine `index.js` and `bot.js` together.

# Usage

| Command             | Description                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------- |
| ./help              | Help embed message                                                                        |
| ./stupid            | Prints out `You Stupid.`                                                                  |
| ./jono              | Prints out `username, Jono agrees that you are stupid`                                    |
| ./nick              | Prints out `nickname, Jono agrees that you are stupid`                                    |
| horse girl          | Any message that contains `horse girl`, bot will react 🐴 👧                              |
| ./url               | Return your avatarURL                                                                     |
| ./fetch             | Fetch 100 most recent messages from the channel and send as `.json`                       |
| ./play `Music URL`  | Play Music                                                                                |
| ./skip              | Skip audio                                                                                |
| ./stop              | Stop audio                                                                                |
| ./media `arguments` | `./media list` for audio list. `./media filename` to play media, file extension is needed |
