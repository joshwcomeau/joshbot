const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'local'}`,
});

if (process.env.NODE_ENV === 'production') {
  require('./dist');
} else {
  require('./src');
}
