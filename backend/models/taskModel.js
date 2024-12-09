const db = require('../config/db');

exports.getAllTasks = (callback) => { db.query('SELECT * FROM tasks', callback); };

exports.updateTask = (id, task, callback) => {
  const { name, stage, start_date, end_date, status, progress } = task;
  db.query(
    'UPDATE tasks SET name = ?, stage = ?, start_date = ?, end_date = ?, status = ?, progress = ? WHERE id = ?',
    [name, stage, start_date, end_date, status, progress, id],
    callback
  );
};