const db = require('../config/db');

exports.getAllTasks = (callback) => { db.query('SELECT * FROM tasks', callback); };
exports.deleteTask = (taskId, callback) => { db.query('DELETE FROM tasks WHERE id = ?', [taskId], callback); };

exports.addTask = (task, callback) => {
  const { name, stage, start_date, end_date, status, progress } = task;
  db.query(
    'INSERT INTO tasks (name, stage, start_date, end_date, status, progress) VALUES (?, ?, ?, ?, ?, ?)',
    [name, stage, start_date, end_date, status, progress],
    callback
  );
};

exports.updateTask = (taskId, taskData, callback) => {
  const { name, stage, start_date, end_date, status, progress } = taskData;
  db.query(
    'UPDATE tasks SET name = ?, stage = ?, start_date = ?, end_date = ?, status = ?, progress = ? WHERE id = ?',
    [name, stage, start_date, end_date, status, progress, taskId],
    callback
  );
};