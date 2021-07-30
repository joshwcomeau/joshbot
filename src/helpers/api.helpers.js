export async function fetchUserByDiscordId(discordId) {
  const response = await fetch(
    `${process.env.API_ROOT}/api/discord/get-user-by-discord-id?id=${discordId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.COURSE_PLATFORM_TOKEN}`,
      },
    }
  );

  const json = await response.json();

  return json.user;
}

export async function lookUpEmail(providedEmail, author) {
  const response = await fetch(
    `${process.env.API_ROOT}/api/discord/look-up-email`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COURSE_PLATFORM_TOKEN}`,
      },
      body: JSON.stringify({
        providedEmail,
        author,
      }),
    }
  );

  const json = await response.json();

  return json;
}
