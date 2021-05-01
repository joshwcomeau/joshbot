const path = require('path');

console.info('–––Starting Joshbot———');

require('dotenv').config({
  path: '.env.local',
});

require('./index');
