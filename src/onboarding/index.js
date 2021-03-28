// import {cleanupGuildOnInterval} from './utils'
import handleNewMember from './handle-new-member';
import handleNewMessage from './handle-new-message';

// import {handleUpdatedMessage} from './handle-updated-message'
// import {cleanup} from './cleanup'

export default function setup(client) {
  client.on('guildMemberAdd', handleNewMember);
  client.on('message', handleNewMessage);
  // client.on('messageUpdate', handleUpdatedMessage)

  // cleanupGuildOnInterval(client, guild => cleanup(guild), 5000)
}
