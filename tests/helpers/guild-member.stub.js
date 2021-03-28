export function createGuildMember({
  nickname,
  id,
  username,
  discriminator,
  roles = [],
}) {
  return {
    guild: {},
    nickname,
    user: {
      id,
      username,
      bot: false,
      discriminator,
    },
    roles: {
      cache: {
        find: (fn) => roles.find(fn),
        has: (roleId) => !!roles.find((role) => role.id === roleId),
      },
    },
    send: jest.fn((x) => new Promise((resolve) => resolve(x))),
  };
}
