const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

require('dotenv').config({
  path: __dirname + '/' +
    (process.env.NODE_ENV == 'production' ? '.prod.env' : '.dev.env')
});

const config = {
  ENVIRONMENT: env,
  JWT_SECRET: process.env.JWT_SECRET,
  DOG_KEY: process.env.DOG_KEY
};

module.exports = config;
