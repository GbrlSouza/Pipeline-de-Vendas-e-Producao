const tasksController = require('../controllers/tasksController');
const express = require('express');
const router = express.Router();

router.post('/', tasksController.addTask);
router.get('/', tasksController.getTasks);
router.put('/', tasksController.updateTask);
router.delete('/', tasksController.deleteTask);

module.exports = router;