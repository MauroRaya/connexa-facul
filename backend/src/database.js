const path = require('path');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname, '../../database/connexa.db');
const db = new sqlite3.Database(dbPath);

module.exports = db;
