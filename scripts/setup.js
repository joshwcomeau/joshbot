// TODO: Consolidate with tests/helpers/setup
const path = require('path');

require('dotenv').config({
  // TODO: Don't do this in CI!
  // path: '.env.local',
  path: '.env.production',
});
