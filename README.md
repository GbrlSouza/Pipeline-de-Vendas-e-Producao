# Pipeline-de-Vendas-e-Producao

- Localhost | PHPMyAdmin | XAMPP

```mysql
CREATE DATABASE IF NOT EXISTS pipeline_db;

USE pipeline_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stage ENUM('Prospecção', 'Negociação', 'Produção', 'Entrega') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Pendente', 'Em Andamento', 'Concluído') DEFAULT 'Pendente',
    progress DECIMAL(5, 2),
    predecessor VARCHAR(255) DEFAULT NULL  -- Coluna para dependência
);

INSERT INTO tasks (name, stage, start_date, end_date, status, predecessor)
VALUES 
('Contato inicial', 'Prospecção', '2024-12-01', '2024-12-03', 'Pendente', 80, NULL),
('Negociação de contrato', 'Negociação', '2024-12-04', '2024-12-05', 'Em Andamento', 60, '1FS');
```

- Estrutura do projeto

```bash
pipeline-project/

│
├── backend/                       # Backend do projeto
│   ├── index.js                   # Arquivo principal do servidor
│   ├── config/                    # Configurações do banco de dados
│   │   └── db.js                  # Conexão com o banco de dados
│   │
│   ├── routes/                    # Rotas da API
│   │   └── tasks.js               # Rotas relacionadas a tarefas
│   │
│   ├── controllers/               # Controladores da lógica de negócio
│   │   └── tasksController.js     # Lógica de manipulação de tarefas
│   │
│   ├── models/                    # Modelos do banco de dados
│   │   └── taskModel.js           # Modelo para interagir com a tabela `tasks`
│   │
│   └── package.json               # Dependências do backend
│
├── frontend/                      # Frontend do projeto
│   ├── public/                    # Arquivos públicos
│   │   ├── index.html             # Arquivo HTML principal
│   │   ├── style.css              # Estilos para o frontend
│   │   └── app.js                 # Lógica do frontend
│   │
│   ├── src/                       # Código fonte adicional (opcional)
│   ├── package.json               # Dependências do frontend (se usar npm)
│   └── README.md                  # Documentação do frontend
│
├── database/                      # Arquivos relacionados ao banco de dados
│   ├── schema.sql                 # Script para criar tabelas
│   └── seed.sql                   # Script para popular tabelas (dados iniciais)
│
├── README.md                      # Documentação geral do projeto
└── LICENSE                        # Licensa do projeto
```
