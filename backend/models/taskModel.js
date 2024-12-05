const db = require('../config/db');

exports.getAllTasks = (callback) => {
  db.query('SELECT * FROM tasks', callback);
};

exports.addTask = (task, callback) => {
  const { name, stage, start_date, end_date, status } = task;
  db.query(
    'INSERT INTO tasks (name, stage, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
    [name, stage, start_date, end_date, status],
    callback
  );
};