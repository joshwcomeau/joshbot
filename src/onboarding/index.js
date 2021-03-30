import handleNewMember from './handle-new-member';
import handleNewMessage from './handle-new-message';

// import {handleUpdatedMessage} from './handle-updated-message'
// import {cleanup} from './cleanup'

export default function setup(client) {
  client.on('guildMemberAdd', handleNewMember);
  client.on('message', (message) => {
    handleNewMessage(message, {
      addRole(roleName) {
        const guild = client.guilds.cache.get(
          process.env.DISCORD_GUILD_ID
        );

        const role = guild.roles.cache.find(
          (role) => role.name === roleName
        );

        guild.members.cache.get(message.author.id).roles.add(role.id);
      },
    });
  });
}
