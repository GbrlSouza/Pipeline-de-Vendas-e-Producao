const db = require('../config/db');
const taskModel = require('../models/taskModel');

exports.getAllTasks = (callback) => { db.query('SELECT * FROM tasks', callback); };

exports.addTask = (task, callback) => {
  const { name, stage, start_date, end_date, status, progress } = task;
  db.query(
    'INSERT INTO tasks (name, stage, start_date, end_date, status, progress) VALUES (?, ?, ?, ?, ?, ?)',
    [name, stage, start_date, end_date, status, progress],
    callback
  );
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const taskData = req.body;
  taskModel.updateTask(taskId, taskData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa atualizada com sucesso' });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  taskModel.deleteTask(taskId, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir a tarefa' });
    if (result.affectedRows === 0) { return res.status(404).json({ error: 'Tarefa não encontrada' }); }
    res.json({ message: 'Tarefa excluída com sucesso' });
  });
};