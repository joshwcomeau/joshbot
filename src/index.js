import Discord from 'discord.js';
import { setup } from './setup';

function start() {
  const client = new Discord.Client();

  client.login(process.env.DISCORD_BOT_TOKEN);

  client.on('ready', () => {
    setup(client);
  });
}

start();
