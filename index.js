const path = require('path');

require('dotenv').config({
  path: '.env.local',
});

if (process.env.NODE_ENV === 'production') {
  require('./dist');
} else {
  require('./src');
}
