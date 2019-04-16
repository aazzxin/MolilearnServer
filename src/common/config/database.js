const mysql = require('think-model-mysql');

module.exports = {
  handle: mysql,
  database: 'molilearn',
  prefix: 'molilearn_',
  encoding: 'utf8mb4',
  host: '123.207.111.240',
  port: '3306',
  user: 'root',
  password: 'AAZZbing345+mysql',
  dateStrings: true
};
