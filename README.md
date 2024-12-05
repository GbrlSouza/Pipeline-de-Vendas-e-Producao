# Pipeline-de-Vendas-e-Producao

- Localhost | phpmyadmin | xampp

```mysql
CREATE DATABASE pipeline_db;

USE pipeline_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Prospecção', 'Negociação', 'Produção', 'Entrega') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Estrutura

```
pipeline-project/
├── backend/                   # Backend do projeto
│   ├── index.js               # Arquivo principal do servidor
│   ├── config/                # Configurações do banco de dados
│   │   └── db.js              # Conexão com o banco de dados
│   ├── routes/                # Rotas da API
│   │   └── tasks.js           # Rotas relacionadas a tarefas
│   ├── controllers/           # Controladores da lógica de negócio
│   │   └── tasksController.js # Lógica de manipulação de tarefas
│   ├── models/                # Modelos do banco de dados
│   │   └── taskModel.js       # Modelo para interagir com a tabela `tasks`
│   └── package.json           # Dependências do backend
├── frontend/                  # Frontend do projeto
│   ├── public/                # Arquivos públicos
│   │   ├── index.html         # Arquivo HTML principal
│   │   ├── style.css          # Estilos para o frontend
│   │   └── app.js             # Lógica do frontend
│   ├── src/                   # Código fonte adicional (opcional)
│   ├── package.json           # Dependências do frontend (se usar npm)
│   └── README.md              # Documentação do frontend
├── database/                  # Arquivos relacionados ao banco de dados
│   ├── schema.sql             # Script para criar tabelas
│   ├── seed.sql               # Script para popular tabelas (dados iniciais)
├── README.md                  # Documentação geral do projeto
├── LICENSE.txt
```
