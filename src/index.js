import Discord from 'discord.js';
import onboardingSetup from './onboarding';

function start() {
  const client = new Discord.Client();

  client.login(process.env.DISCORD_BOT_TOKEN);

  client.on('ready', () => {
    // TEMPORARILY DISABLED
    console.log('Ready, but disabled');
    // onboardingSetup(client);
  });
}

start();
