require('./setup');

import Discord from 'discord.js';

import { sleep } from '../src/utils';

const GUILD_ID = '783425607492304947'; // Production!
// const GUILD_ID = process.env.DISCORD_GUILD_ID;

function start() {
  const client = new Discord.Client();

  client.login(process.env.DISCORD_BOT_TOKEN);

  client.on('ready', async () => {
    const guild = client.guilds.cache.get(GUILD_ID);

    const role = guild.roles.cache.find(
      (role) => role.name === 'Student'
    );

    let i = 0;

    try {
      const members = await guild.members.fetch();

      for (const entry of members) {
        i++;

        const [, member] = entry;

        // Ignore bots
        if (member.user.bot) {
          continue;
        }

        const alreadyHasRole = !!member.roles.cache.find(
          (role) => role.name === 'Student'
        );

        if (alreadyHasRole) {
          continue;
        }

        member.roles.add(role.id);

        await sleep(500);
      }
    } catch (err) {
      console.error(err);
    }
  });
}

start();
