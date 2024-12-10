const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.post('/', tasksController.addTask);
router.get('/', tasksController.getTasks);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;