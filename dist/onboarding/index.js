"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setup;

var _handleNewMember = _interopRequireDefault(require("./handle-new-member"));

var _handleNewMessage = _interopRequireDefault(require("./handle-new-message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {handleUpdatedMessage} from './handle-updated-message'
// import {cleanup} from './cleanup'
function setup(client) {
  client.on('guildMemberAdd', _handleNewMember.default);
  client.on('message', message => {
    (0, _handleNewMessage.default)(message, {
      addRole(roleName) {
        const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const role = guild.roles.cache.find(role => role.name === roleName);
        guild.members.cache.get(message.author.id).roles.add(role.id);
      }

    });
  });
}