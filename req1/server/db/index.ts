require('dotenv').config();
const Pool = require('pg').Pool

const pool = process.env.NODE_ENV === 'development' ? new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
    port: 5432,
  })
  :
  new Pool({
    user: process.env.RDS_USERNAME,
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  });

export default pool;