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
