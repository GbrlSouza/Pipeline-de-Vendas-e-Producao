CREATE DATABASE IF NOT EXISTS pipeline_db;

USE pipeline_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stage ENUM('Prospecção', 'Negociação', 'Produção', 'Entrega') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Pendente', 'Em Andamento', 'Concluído') DEFAULT 'Pendente'
);