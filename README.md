# Joshbot

**🤖 An artificial Discord community manager.**

This Discord bot is used in the community for the CSS for JavaScript Developers course (and, in the future, other courses I create).

It is open-sourced for educational purposes. Feel free to see how I did things. It is _not_ meant to be plug-and-play for other servers, and I do not have any documentation for it. Also: I am not looking for contributions at this time.

## Local Development

> This is a reminder to self, **not** instructions for other folks. Sorry about that!

The entire "stack" is duplicated for local development. Specifically:

- I use a different Discord bot ID (`DISCORD_BOT_TOKEN`)
- It connects to a different Discord server (`DISCORD_GUILD_ID`)
- It uses a different database to look up users (though now it uses the same DB connection as my prod server, just a different "table")

To test the onboarding flow:

1. Run the bot (`yarn start`)
2. Open MongoDB Compass, look up my test user (`mytypicalemail+backup`). Delete `discordInfo`. Copy the ObjectID, pop over to the `discord-members` collection, and delete the member with `courseUserId` equal to the copied ID.
3. On my regular discord account, pop into the 'Course Platform Staging' Discord server. Copy an invitation link.
4. Log out of Discord, and log in with my `+backup` email. Paste the invite link to be invited to the server
5. The bot should reach out!

## Credits

This bot was _heavily_ inspired by [Kent C. Dodds' Discord bot](https://github.com/kentcdodds/kcd-discord-bot).
