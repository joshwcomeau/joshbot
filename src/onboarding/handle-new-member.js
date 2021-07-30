import { captureUserForLogs } from '../helpers/error.helpers';
import { registerMember } from '../models/member.model';
import { fetchUserByDiscordId } from '../helpers/api.helpers';
import { sleep } from '../utils';

export default async function handleNewMember(
  guildMember,
  addStudentRole
) {
  const preExistingMember = await fetchUserByDiscordId(
    guildMember.user.id
  );

  if (preExistingMember) {
    captureUserForLogs(preExistingMember);
    addStudentRole(guildMember.user.id);

    await guildMember.send('Welcome back!');

    return;
  }

  const member = await registerMember(guildMember);

  const name = member.nickname || member.username;
  try {
    await guildMember.send(
      `Hey ${name}! Welcome to this Discord server 😄`
    );
    await sleep(1234);
    await guildMember.send(
      `This server is meant exclusively for folks who have purchased the “CSS for JavaScript Developers” course.`
    );
    await sleep(1876);
    await guildMember.send(
      `Can you please send me the **email address** you used during purchase?`
    );
  } catch (err) {
    // TODO: Proper error handling
    console.error('CAUGHT', err);
  }
}

/*
GuildMember {
  guild: Guild {
    members: GuildMemberManager {
      cacheType: [Function: Collection],
      cache: [Collection [Map]],
      guild: [Circular]
    },
    channels: GuildChannelManager {
      cacheType: [Function: Collection],
      cache: [Collection [Map]],
      guild: [Circular]
    },
    roles: RoleManager {
      cacheType: [Function: Collection],
      cache: [Collection [Map]],
      guild: [Circular]
    },
    presences: PresenceManager {
      cacheType: [Function: Collection],
      cache: [Collection [Map]]
    },
    voiceStates: VoiceStateManager {
      cacheType: [Function: Collection],
      cache: Collection [Map] {},
      guild: [Circular]
    },
    deleted: false,
    available: true,
    id: '825156982100721684',
    shardID: 0,
    name: 'Course Platform (staging)',
    icon: null,
    splash: null,
    discoverySplash: null,
    region: 'us-east',
    memberCount: 3,
    large: false,
    features: [],
    applicationID: null,
    afkTimeout: 300,
    afkChannelID: null,
    systemChannelID: '825156982100721687',
    embedEnabled: undefined,
    premiumTier: 0,
    premiumSubscriptionCount: 0,
    verificationLevel: 'NONE',
    explicitContentFilter: 'DISABLED',
    mfaLevel: 0,
    joinedTimestamp: 1616803487663,
    defaultMessageNotifications: 'ALL',
    systemChannelFlags: SystemChannelFlags { bitfield: 0 },
    maximumMembers: 100000,
    maximumPresences: null,
    approximateMemberCount: null,
    approximatePresenceCount: null,
    vanityURLCode: null,
    vanityURLUses: null,
    description: null,
    banner: null,
    rulesChannelID: null,
    publicUpdatesChannelID: null,
    preferredLocale: 'en-US',
    ownerID: '296699474628050944',
    emojis: GuildEmojiManager {
      cacheType: [Function: Collection],
      cache: Collection [Map] {},
      guild: [Circular]
    }
  },
  joinedTimestamp: 1616867687702,
  lastMessageID: null,
  lastMessageChannelID: null,
  premiumSinceTimestamp: 0,
  deleted: false,
  nickname: null,
  _roles: [],
  user: User {
    id: '477447133377724427',
    system: null,
    locale: null,
    flags: UserFlags { bitfield: 0 },
    username: 'joshwcomeau',
    bot: false,
    discriminator: '0211',
    avatar: '1b675ac1433c594326f9b5484f07b119',
    lastMessageID: null,
    lastMessageChannelID: null
  }
}
*/
