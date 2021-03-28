import handleNewMember from '../src/onboarding/handle-new-member';
import connectToDatabase from '../src/database';

import { createGuildMember } from './helpers/guild-member.stub';
import resetDb from './helpers/reset-db';

describe('Onboarding', () => {
  beforeEach((done) => {
    resetDb().then(done);
  });
  afterAll(async (done) => {
    const { closeConnection } = await connectToDatabase();
    closeConnection();
  });

  describe('handleNewMember', () => {
    it('ignores users who already have the “Student” role', async () => {
      const member = createGuildMember({
        id: 'abc123',
        username: 'old-guard',
        discriminator: '1234',
        roles: [
          {
            id: 'student',
            name: 'Student',
          },
        ],
      });

      await handleNewMember(member);

      expect(member.send.mock.calls.length).toBe(0);
    });

    it('welcomes brand-new users', async () => {
      const member = createGuildMember({
        id: 'abc123',
        username: 'old-guard',
        discriminator: '1234',
      });

      await handleNewMember(member);

      expect(member.send.mock.calls.length).toBe(3);
      expect(member.send.mock.calls[0][0]).toBe(
        `Hey old-guard! Welcome to this Discord server 😄`
      );
    });
  });
});
