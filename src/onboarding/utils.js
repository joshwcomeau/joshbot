import { EMAIL_ATTEMPT_LIMIT } from '../constants';

export async function fetchUserByDiscordId(discordId) {
  const response = await fetch(
    `${process.env.API_ROOT}/api/discord/get-user-by-discord-id?id=${discordId}`
  );

  const json = await response.json();

  return json.user;
}

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
