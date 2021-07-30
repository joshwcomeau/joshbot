import { EMAIL_ATTEMPT_LIMIT } from '../constants';
import { sleep } from '../utils';

export function getStep(member) {
  const hasExceededEmailLimit =
    member.emailAttemptCount > EMAIL_ATTEMPT_LIMIT;

  if (!member.courseUserId && !hasExceededEmailLimit) {
    return 'enter-email';
  }

  if (hasExceededEmailLimit) {
    return 'too-many-attempts';
  }

  if (!member.hasAgreedToRules) {
    return 'agree-to-rules';
  }

  return 'onboarding-completed';
}

export async function speakEmailLookupSucceeded(author, courseName) {
  await author.send(
    `✅ I found your account. Welcome to Discord, ${courseName}!`
  );

  // TODO: Embed!
  await sleep(750);

  await author.send(
    `On this server, we take the Code of Conduct seriously. Please take a moment to check it out here: https://courses.joshwcomeau.com/code-of-conduct`
  );

  await sleep(890);
  await author.send(
    `**Do you agree to do your best to abide by the code of conduct?**`
  );

  await sleep(500);
  await author.send(`(the only accepted answer is _yes_)`);
}

export async function speakUserNotFound(author, member) {
  if (member.emailAttemptCount === 0) {
    await author.send(
      "I wasn't able to find an account with that email."
    );
    await sleep(1000);

    await author.send(
      'You can check which email you used by visiting https://courses.joshwcomeau.com/account.'
    );
  } else if (member.emailAttemptCount === 1) {
    await author.send(
      "Sorry, that still doesn't seem right. Email addresses are case-sensitive, does the capitalization match?"
    );
  } else if (member.emailAttemptCount === 2) {
    await author.send(
      "We don't have any records under that email address. You can try one more time, otherwise you'll need to contact support"
    );
  } else {
    await author.send(
      "Sorry, still no luck. It's possible there's an issue with the system. Please email support@joshwcomeau.com."
    );
  }
}

export async function speakEmailAlreadyUsed(author) {
  await author.send(
    'Hm, so that email address is already linked to another Discord account.'
  );
  await sleep(2000);
  await author.send(
    "If you'd like to switch which Discord account you use, please email support@joshwcomeau.com."
  );
}

export async function speakDisagreeWithRules(author) {
  await author.send('Thank you for the candid response.');
  await sleep(1000);

  await author.send(
    'You can email any concerns you have about the Code of Conduct to support@joshwcomeau.com.'
  );
  await sleep(1000);
  await author.send(
    "In the meantime, regrettably, I'm afraid you won't be able to access this community."
  );
}

export async function speakAgreeWithRules(author) {
  await author.send('Response accepted! 💖');
  await sleep(1000);
  await author.send(
    'You now have access to the entire server. Welcome aboard! 🥳 🎉'
  );
  await sleep(1000);
  await author.send(
    `We'd love to get to know you a bit. Tell us about yourself in the <#${process.env.DISCORD_INTRODUCTION_CHANNEL_ID}> channel.`
  );
}

export async function speakSelfDestruct(author) {
  await author.send(
    'Records indicate that you initiation sequence has been resolved. You may access the server now.'
  );
  await sleep(1000);
  await author.send(
    `Recommendation: Visit the <#${process.env.DISCORD_INTRODUCTION_CHANNEL_ID}> channel to begin.`
  );
  await sleep(1500);
  await author.send('Self-destruct sequence initiated.');
  await sleep(1000);
  author.send('3…');
  await sleep(1000);
  author.send('2…');
  await sleep(1000);
  author.send('1…');
  await sleep(1500);
  await author.send('💥');
}
