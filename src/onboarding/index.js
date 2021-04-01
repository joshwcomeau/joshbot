import handleNewMember from './handle-new-member';
import handleNewMessage from './handle-new-message';

export default function setup(client) {
  function addStudentRole(userId) {
    const guild = client.guilds.cache.get(
      process.env.DISCORD_GUILD_ID
    );

    const role = guild.roles.cache.find(
      (role) => role.name === 'Student'
    );

    guild.members.cache.get(userId).roles.add(role.id);
  }

  client.on('guildMemberAdd', (guildMember) => {
    handleNewMember(guildMember, addStudentRole);
  });

  client.on('message', (message) => {
    handleNewMessage(message, addStudentRole);
  });
}
