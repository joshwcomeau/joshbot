import fetch from 'isomorphic-unfetch';

import {
  registerMember,
  getMemberByDiscordId,
  incrementInvalidEmailCount,
  linkMemberToCourseUser,
  disagreeWithRules,
  agreeWithRules,
} from '../models/member.model';
import {
  getStep,
  speakEmailLookupSucceeded,
  speakUserNotFound,
  speakEmailAlreadyUsed,
  speakDisagreeWithRules,
  speakAgreeWithRules,
  speakSelfDestruct,
} from './utils';

export default async function handleNewMessage(
  { channel, author, content, ...rest },
  { addRole }
) {
  // Ignore everything except direct messages to the bot
  const isFromMe = author.bot;
  const isDM = channel.type === 'dm';
  if (isFromMe || !isDM) {
    return;
  }

  let member = await getMemberByDiscordId(author.id);

  // If we don't have a member, it must be a race-condition.
  // Let's try re-registering the member.
  if (!member) {
    member = await registerMember({ user: author });
  }

  if (member.badSeed) {
    await send(
      'Your account has been flagged. Please contact support for more information.'
    );
  }

  const step = getStep(member);

  switch (step) {
    case 'enter-email': {
      const providedEmail = content.trim();

      const response = await fetch(
        `${process.env.API_ROOT}/api/discord/look-up-email`,
        {
          method: 'POST',
          body: JSON.stringify({
            providedEmail,
            author,
          }),
        }
      );

      const json = await response.json();

      if (json.status === 'success') {
        await linkMemberToCourseUser(member, json.user);
        await speakEmailLookupSucceeded(author, json.user.name);
      } else if (json.error === 'user-not-found') {
        await speakUserNotFound(author, member);
        await incrementInvalidEmailCount(author.id);
      } else if (json.error === 'already-linked-to-another-account') {
        await speakEmailAlreadyUsed(author);
      } else {
        await author.send(
          'Hm, something unexpected has happened. Please contact support@joshwcomeau.com, and include your Discord username + the email you just provided.'
        );
      }

      break;
    }

    case 'too-many-attempts': {
      await author.send(
        "I'm afraid you've entered too many incorrect email addresses. Please send an email to support@joshwcomeau.com."
      );

      break;
    }

    case 'agree-to-rules': {
      const providedAnswer = content.trim().toLowerCase();

      if (
        providedAnswer === 'no' ||
        providedAnswer === 'nah' ||
        providedAnswer === 'nope'
      ) {
        await disagreeWithRules(member);
        await speakDisagreeWithRules(author);
      } else if (
        providedAnswer === 'yes' ||
        providedAnswer === 'yep' ||
        providedAnswer === 'yeah' ||
        providedAnswer === 'ya'
      ) {
        await agreeWithRules(member);
        addRole('Student');

        await speakAgreeWithRules(author);
      } else {
        await author.send(
          "I didn't understand that response. Please say _yes_ if you agree. Otherwise, feel free to reach out to Josh at support@joshwcomeau.com."
        );
      }
      break;
    }

    case 'onboarding-completed':
    default: {
      await speakSelfDestruct(author);
      break;
    }
  }
}

/*
Message {
  channel: DMChannel {
    type: 'dm',
    deleted: false,
    id: '825158436698325032',
    recipient: [User],
    lastMessageID: '825486305693270037',
    lastPinTimestamp: null,
    messages: [MessageManager],
    _typing: Map {}
  },
  deleted: false,
  id: '825486305693270037',
  type: 'DEFAULT',
  system: false,
  content: 'baaa',
  author: User {
    id: '296699474628050944',
    system: null,
    locale: null,
    flags: [UserFlags],
    username: 'Josh',
    bot: false,
    discriminator: '3187',
    avatar: 'd7a06dbf888796fb1fd5e4dfa6f73b9c',
    lastMessageID: '825486305693270037',
    lastMessageChannelID: '825158436698325032'
  },
  pinned: false,
  tts: false,
  nonce: '825486305428242432',
  embeds: [],
  attachments: Collection [Map] {},
  createdTimestamp: 1616881672071,
  editedTimestamp: 0,
  reactions: ReactionManager {
    cacheType: [Function: Collection],
    cache: Collection [Map] {},
    message: [Circular]
  },
  mentions: MessageMentions {
    everyone: false,
    users: Collection [Map] {},
    roles: Collection [Map] {},
    _members: null,
    _channels: null,
    crosspostedChannels: Collection [Map] {}
  },
  webhookID: null,
  application: null,
  activity: null,
  _edits: [],
  flags: MessageFlags { bitfield: 0 },
  reference: null
}
*/
