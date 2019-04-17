const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'molilearn',
  prefix: 'molilearn_',
  encoding: 'utf8mb4',
  host: '',
  port: '3306',
  user: 'root',
  password: '',
  dateStrings: true
};
