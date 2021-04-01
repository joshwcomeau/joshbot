"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setup;

var _handleNewMember = _interopRequireDefault(require("./handle-new-member"));

var _handleNewMessage = _interopRequireDefault(require("./handle-new-message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setup(client) {
  function addStudentRole(userId) {
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    const role = guild.roles.cache.find(role => role.name === 'Student');
    guild.members.cache.get(userId).roles.add(role.id);
  }

  client.on('guildMemberAdd', guildMember => {
    (0, _handleNewMember.default)(guildMember, addStudentRole);
  });
  client.on('message', message => {
    (0, _handleNewMessage.default)(message, addStudentRole);
  });
}