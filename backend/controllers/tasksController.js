const taskModel = require('../models/taskModel');

exports.getTasks = (req, res) => {
  taskModel.getAllTasks((err, tasks) => {
    if (err) return res.status(500).json({ error: 'Erro ao carregar as tarefas' });
    res.json(tasks);
  });
};

exports.addTask = (req, res) => {
  const taskData = req.body;
  taskModel.addTask(taskData, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar a tarefa' });
    res.json({ id: result.insertId, message: 'Tarefa criada com sucesso' });
  });
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const taskData = req.body;

  taskModel.updateTask(taskId, taskData, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa atualizada com sucesso' });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  taskModel.deleteTask(taskId, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir a tarefa' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ message: 'Tarefa excluída com sucesso' });
  });
};