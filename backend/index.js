const tasksRoutes = require('./routes/tasks');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/tasks', tasksRoutes);

// Servidor
const PORT = 3000;
app.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}`); });