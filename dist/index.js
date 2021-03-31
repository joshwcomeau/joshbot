"use strict";

var _discord = _interopRequireDefault(require("discord.js"));

var _onboarding = _interopRequireDefault(require("./onboarding"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
  const client = new _discord.default.Client();
  client.login(process.env.DISCORD_BOT_TOKEN);
  client.on('ready', () => {
    // TEMPORARILY DISABLED
    console.log('Ready, but disabled'); // onboardingSetup(client);
  });
}

start();