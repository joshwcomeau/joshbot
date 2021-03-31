const path = require('path');

console.info('–––Starting Joshbot———');

require('dotenv').config({
  path: '.env.local',
});

if (process.env.NODE_ENV === 'production') {
  require('./dist');
} else {
  require('./src');
}
