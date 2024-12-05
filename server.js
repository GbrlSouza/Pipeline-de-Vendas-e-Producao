const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pipeline_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados!');
});

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;

  db.query(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, description, status],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, title, description, status });
    }
  );
});

app.put('/tasks/:id', (req, res) => {
  const { status } = req.body;

  db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Tarefa atualizada com sucesso!' });
    }
  );
});

app.listen(port, () => { console.log(`Servidor rodando na porta ${port}`); });