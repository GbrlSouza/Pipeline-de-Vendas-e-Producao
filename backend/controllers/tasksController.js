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

exports.updateTask = (req, res) => {
  const taskId = req.body.id;
  const taskData = req.body;

  taskModel.updateTask(taskId, taskData, (err, result) => {
    if (err) {
      console.error("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ error: 'Erro ao atualizar tarefa' }); 
    }
    if (result.affectedRows === 0) { return res.status(404).json({ error: 'Tarefa não encontrada' }); }
    res.json({ message: 'Tarefa atualizada com sucesso' });
  });
};