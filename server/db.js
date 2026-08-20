const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
