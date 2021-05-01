import Discord from 'discord.js';
import onboardingSetup from './onboarding';

function start() {
  console.log('\n\n\n\nSTART with DATABASE NAME\n');
  console.log(process.env.MONGODB_URI);
  console.log(process.env.MONGODB_DB);
  console.log('\n\n\n\n');
  const client = new Discord.Client();

  client.login(process.env.DISCORD_BOT_TOKEN);

  client.on('ready', () => {
    onboardingSetup(client);
  });
}

start();
