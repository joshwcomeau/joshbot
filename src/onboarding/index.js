import { trackEvent, resetScope } from '../helpers/error.helpers';
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
    resetScope();

    const [trackError, trackComplete] = trackEvent('add-new-member');

    handleNewMember(guildMember, addStudentRole)
      .then(trackComplete)
      .catch((err) => {
        console.error('ERROR', err, guildMember);
        const metadata = {
          guild: {
            name: guildMember.guild.name,
          },
          discordMember: {
            id: guildMember.user.id,
            username: guildMember.user.username,
            discriminator: guildMember.user.discriminator,
            joinedAt: guildMember.joinedTimestamp,
          },
        };
        trackError(err, metadata);

        console.error('Error handling new member', err, metadata);
      });
  });

  client.on('message', (message) => {
    resetScope();

    // Ignore everything except direct messages to the bot
    const isFromMe = message.author.bot;
    const isDM = message.channel.type === 'dm';
    if (isFromMe || !isDM) {
      return;
    }

    const [trackError, trackComplete] = trackEvent('receive-message');

    handleNewMessage(message, addStudentRole)
      .then(trackComplete)
      .catch((err) => {
        const metadata = {
          message: {
            content: message.content,
          },
          author: {
            id: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator,
          },
        };

        trackError(err, metadata);

        console.error('Error handling message', err, metadata);
      });
  });
}
