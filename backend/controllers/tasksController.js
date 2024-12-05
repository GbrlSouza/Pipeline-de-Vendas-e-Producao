const taskModel = require('../models/taskModel');

exports.getTasks = (req, res) => {
  taskModel.getAllTasks((err, tasks) => {
    if (err) return res.status(500).json(err);
    res.json(tasks);
  });
};

exports.addTask = (req, res) => {
  const taskData = req.body;
  taskModel.addTask(taskData, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, message: 'Tarefa criada' });
  });
};