import fetch from 'isomorphic-unfetch';

import {
  getMemberByDiscordId,
  handleEnterInvalidEmail,
  linkMemberToCourseUser,
  disagreeWithRules,
} from '../models/member.model';

export default async function handleNewMessage({
  channel,
  author,
  content,
  ...rest
}) {
  const studentRole = channel.guild.roles.cache.find(
    (role) => role.name === 'Student'
  );

  // Ignore everything except direct messages to the bot
  const isFromMe = author.bot;
  const isDM = channel.type === 'dm';
  if (isFromMe || !isDM) {
    return;
  }

  const member = await getMemberByDiscordId(author.id);

  // TODO: Handle member-not-found (should be impossible?)

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
        // Update member
        await linkMemberToCourseUser(member, json.user);
        await author.send(`Welcome to Discord, ${json.user.name}!`);

        // TODO: Embed!
        await author.send(
          `On this server, we take the Code of Conduct seriously. Please take a moment to check it out here: https://courses.joshwcomeau.com/code-of-conduct`
        );
        await author.send(
          `**Do you agree to do your best to abide by the code of conduct?**`
        );
        await author.send(`(the only accepted answer is _yes_)`);
      } else {
        if (json.error === 'user-not-found') {
          // TODO: Check the attempts.
          // Change the message each time
          await handleEnterInvalidEmail(author.id);
          await author.send(
            "I wasn't able to find an account with that email."
          );
          await author.send(
            'You can check which email you used by visiting https://courses.joshwcomeau.com/account.'
          );
        }
      }

      break;
    }

    case 'too-many-attempts': {
      await author.send(
        "I'm afraid you've entered too many invalid email addresses. Please send an email to support@joshwcomeau.com."
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
        await disagreeWithRules(author);
        await author.send('Thank you for the candid response.');
        await author.send(
          'You can email any concerns you have about the Code of Conduct to support@joshwcomeau.com.'
        );
        await author.send(
          "In the meantime, regrettably, I'm afraid you won't be able to access this community."
        );
      } else if (
        providedAnswer === 'yes' ||
        providedAnswer === 'yep' ||
        providedAnswer === 'yeah' ||
        providedAnswer === 'ya'
      ) {
        await agreeWithRules(author);

        author.roles.add(studentRole).catch((err) => {
          console.error(err);
          // TODO: Proper error handling!
        });

        await author.send('Response accepted! 💖');
        await author.send(
          'You now have access to the entire server. Welcome aboard! 🥳 🎉'
        );
        await author.send(
          "We'd love to get to know you a bit. Tell us about yourself in the #👋🏻-introductions channel."
        );
      } else {
        await author.send(
          "I didn't understand that response. Please say _yes_ if you agree. Otherwise, feel free to reach out to Josh at support@joshwcomeau.com."
        );
      }
      break;
    }

    case 'onboarding-completed':
    default: {
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
