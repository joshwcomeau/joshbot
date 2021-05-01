"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMember = registerMember;
exports.getMemberByDiscordId = getMemberByDiscordId;
exports.incrementInvalidEmailCount = incrementInvalidEmailCount;
exports.linkMemberToCourseUser = linkMemberToCourseUser;
exports.disagreeWithRules = disagreeWithRules;
exports.agreeWithRules = agreeWithRules;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COLLECTION_NAME = 'discord-members'; // Create a new user when someone joins the Discord

async function registerMember(member) {
  const {
    nickname,
    user: {
      id: discordId,
      username
    }
  } = member;
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME); // Check if it already exists

  const preExistingMember = await collection.findOne({
    discordId
  });

  if (preExistingMember) {
    // TODO: What should I do in this case?
    // Should I update the `joinedAt` and reset the
    // status?
    return preExistingMember;
  }

  const result = await collection.insertOne({
    discordId,
    nickname,
    username,
    joinedAt: Date.now(),
    emailAttemptCount: 0,
    courseUserId: null,
    hasAgreedToRules: false,
    badSeed: false
  });

  if (result.insertedCount !== 1) {
    throw new Error('did not insert a new user');
  }

  const refreshedMember = await collection.findOne({
    discordId
  });
  return refreshedMember;
}

async function getMemberByDiscordId(discordId) {
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME);
  const member = await collection.findOne({
    discordId
  });
  return member;
}

async function incrementInvalidEmailCount(discordId) {
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME);
  return collection.updateOne({
    discordId
  }, {
    $inc: {
      emailAttemptCount: 1
    }
  });
}

async function linkMemberToCourseUser(member, user) {
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME);
  return collection.updateOne({
    discordId: member.discordId
  }, {
    $set: {
      courseUserId: user.id
    }
  });
}

async function disagreeWithRules(member) {
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME);
  return collection.updateOne({
    discordId: member.discordId
  }, {
    $set: {
      badSeed: true,
      badSeedReason: 'said-no-to-rules'
    }
  });
}

async function agreeWithRules(member) {
  const {
    db
  } = await (0, _database.default)();
  const collection = db.collection(COLLECTION_NAME);
  return collection.updateOne({
    discordId: member.discordId
  }, {
    $set: {
      hasAgreedToRules: true
    }
  });
}